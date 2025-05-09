# J74

import pytest
import asyncio
from main import Passenger, predict_survival

# Initializing data for testing as a dictionary
test_passenger = {
    "Title" : "Mr",
    "PClass" : 1,
    "Sex" : "male",
    "Age" : 32,
    "Fare" : 700,
    "TraveledAlone" : True,
    "AgeClass" : 32,
    "Embarked" : "Cherbourg",
    "models" : ["random_forest"]
}


# Defining test functions for validations functions given in the Passenger Class

def test_validate_title():
    assert Passenger.validate_title(test_passenger["Title"]) == "Mr", "Invalid Passenger Title, Test failed!"

def test_invalid_title():
    with pytest.raises(ValueError, match = 'Invalid Title'):
        Passenger.validate_title("Dr")

def test_validate_pclass():
    assert Passenger.validate_pclass(test_passenger["PClass"]) == 1, "Invalid Passenger Class, Test failed!"

def test_invalid_pclass():
    with pytest.raises(ValueError, match = 'Invalid PClass'):
        Passenger.validate_pclass("3")

def test_validate_sex():
    assert Passenger.validate_sex(test_passenger["Sex"]) == "male", "Invalid Sex, Test failed!"

def test_invalid_sex():
    with pytest.raises(ValueError, match = 'Invalid Sex'):
        Passenger.validate_sex("Prefer not to say")

def test_validate_embarked():
    assert Passenger.validate_embarked(test_passenger["Embarked"]) == "Cherbourg", "Invalid Embarked, Test failed!"

def test_invalid_embarked():
    with pytest.raises(ValueError, match = 'Invalid Embarked'):
        Passenger.validate_embarked("Spain")



# Defining test function for the prediction function
def test_predict_survival():

    # Creating an instance of the class Passenger inorder to test the prediction
    test_passenger1 = Passenger(
        Title="Mr",
        PClass=1,
        Sex="male",
        Age=32,
        Fare=700,
        AgeClass=32,
        TraveledAlone=True,
        Embarked="Cherbourg",
        models=["Random Forest", "Decision Tree"]
    )

    loop = asyncio.get_event_loop()
    test_predictions = loop.run_until_complete(predict_survival(test_passenger1))

    # Asserting the prediction values...
    assert test_predictions["Random Forest"] == "Survived"
    assert test_predictions["Decision Tree"] == "Survived"