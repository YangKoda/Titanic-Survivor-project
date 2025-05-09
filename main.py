from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import pickle

app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your models
models = {
    "Random Forest": pickle.load(open("models/random_forest.pkl", "rb")),
    "Decision Tree": pickle.load(open("models/decision_tree.pkl", "rb")),
    "KNN": pickle.load(open("models/knn.pkl", "rb")),
    "SVM": pickle.load(open("models/support_vector_machines.pkl", "rb")),
    "Logistic Regression": pickle.load(open("models/linear_svc.pkl", "rb")),
}

# Define the request body
class Passenger(BaseModel):
    Title: str
    PClass: int
    Sex: str
    Age: int
    Fare: float
    TraveledAlone: bool
    Embarked: str
    models: list

    @validator('Title')
    def validate_title(cls, value):
        valid_titles = {"Master", "Mr", "Mrs", "Miss", "Rare"}
        if value not in valid_titles:
            raise ValueError('Invalid Title')
        return value

    @validator('PClass')
    def validate_pclass(cls, value):
        if value not in [1, 2, 3]:
            raise ValueError('Invalid PClass')
        return value

    @validator('Sex')
    def validate_sex(cls, value):
        if value not in ["male", "female"]:
            raise ValueError('Invalid Sex')
        return value

    @validator('Embarked')
    def validate_embarked(cls, value):
        if value not in ["Cherbourg", "Queenstown", "Southampton"]:
            raise ValueError('Invalid Embarked')
        return value

    ##@validator('AgeClass', pre=True, always=True)
    ##def calculate_ageclass(cls, value, values):
        ##return values['PClass'] * values['Age']


@app.post("/predict")
async def predict_survival(passenger: Passenger):
    title_mapping = {"Master": 4, "Mr": 1, "Mrs": 3, "Miss": 2, "Rare": 5}
    embarked_mapping = {"Cherbourg": 1, "Queenstown": 2, "Southampton": 0}

    AgeClass = passenger.Age * passenger.PClass

    features = [
        title_mapping[passenger.Title],
        passenger.PClass,
        1 if passenger.Sex == "male" else 0,
        passenger.Age,
        AgeClass,
        passenger.Fare,
        1 if passenger.TraveledAlone else 0,
        embarked_mapping[passenger.Embarked]
    ]
    print(features)
    predictions = {}
    for model_name in passenger.models:
        if model_name not in models:
            raise HTTPException(status_code=404, detail=f"Model {model_name} not found")
        model = models[model_name]
        prediction = model.predict([features])
        predictions[model_name] = "Survived" if prediction[0] == 1 else "Did not survive"

    return predictions
