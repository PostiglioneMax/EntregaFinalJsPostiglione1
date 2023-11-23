const availableFoods = [
    { name: "Eggs", calories: 68, carbs: 2, proteins: 6, fats: 5 },
    { name: "Oats", calories: 117, carbs: 51, proteins: 13, fats: 5 },
    { name: "Banana", calories: 110, carbs: 28, proteins: 1, fats: 0 },
    { name: "Manzana", calories: 52, carbs: 9, proteins: 0, fats: 0 },
    { name: "Rice", calories: 130, carbs: 28, proteins: 2.7, fats: 0.3 },
    { name: "Chicken", calories: 239, carbs: 0, proteins: 27, fats: 14 },
    { name: "Milk", calories: 42, carbs: 5, proteins: 3.4, fats: 1 },
    { name: "Bread", calories: 265, carbs: 49, proteins: 9, fats: 3.2 },
    { name: "Greek yogurt", calories: 59, carbs: 3.6, proteins: 10, fats: 0.4 },
    { name: "Cream cheese", calories: 342, carbs: 4.1, proteins: 6, fats: 34 },
    // agregar a placer
];

// Objetos para MealList y sus nutrition totals
const mealLists = {
    breakfast: document.getElementById("breakfastList"),
    lunch: document.getElementById("lunchList"),
    dinner: document.getElementById("dinnerList"),
    snacks: document.getElementById("snacksList"),
};

const mealCalories = {
    breakfast: document.getElementById("breakfastCalories"),
    lunch: document.getElementById("lunchCalories"),
    dinner: document.getElementById("dinnerCalories"),
    snacks: document.getElementById("snacksCalories"),
};

const mealCarbs = {
    breakfast: document.getElementById("breakfastCarbs"),
    lunch: document.getElementById("lunchCarbs"),
    dinner: document.getElementById("dinnerCarbs"),
    snacks: document.getElementById("snacksCarbs"),
};

const mealProteins = {
    breakfast: document.getElementById("breakfastProteins"),
    lunch: document.getElementById("lunchProteins"),
    dinner: document.getElementById("dinnerProteins"),
    snacks: document.getElementById("snacksProteins"),
};

const mealFats = {
    breakfast: document.getElementById("breakfastFats"),
    lunch: document.getElementById("lunchFats"),
    dinner: document.getElementById("dinnerFats"),
    snacks: document.getElementById("snacksFats"),
};

const myFoodsLists = {
    breakfast: document.getElementById("myFoodsListBreakfast"),
    lunch: document.getElementById("myFoodsListLunch"),
    dinner: document.getElementById("myFoodsListDinner"),
    snacks: document.getElementById("myFoodsListSnacks"),
};

const meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
};

// Array para almacenar custom foods & check local storage for existing data
let myFoods = [];

// Check and load custom food del local storage
const storedMyFoods = JSON.parse(localStorage.getItem("myFoods"));
if (storedMyFoods) {
    myFoods = storedMyFoods;
    displayMyFoods();
}

function constructora(foodName, calories, carbs, proteins, fats) {
    this.name = foodName;
    this.calories = calories;
    this.carbs = carbs;
    this.proteins = proteins;
    this.fats = fats;
}

//aplicando un condicional ternario a uno de los if
function addSelectedFoodToMeal(meal) {
    const foodSelect = document.getElementById("foodSelect");
    const selectedFoodName = foodSelect.value;
    const foodQuantity = parseFloat(document.getElementById("foodQuantity").value);

    const isInputValid = selectedFoodName && !isNaN(foodQuantity) && foodQuantity > 0;
    const selectedFood = isInputValid ? availableFoods.find((food) => food.name === selectedFoodName) : null;

    if (isInputValid && selectedFood) {
        const calories = (selectedFood.calories / 100) * foodQuantity;
        const carbs = (selectedFood.carbs / 100) * foodQuantity;
        const proteins = (selectedFood.proteins / 100) * foodQuantity;
        const fats = (selectedFood.fats / 100) * foodQuantity;

        const food = {
            name: selectedFoodName,
            calories: calories,
            carbs: carbs,
            proteins: proteins,
            fats: fats,
        };

        meals[meal].push(food);
        displayMealFoods(meal);
        updateMealTotals(meal);
        document.getElementById("foodSelect").value = "";
        document.getElementById("foodQuantity").value = "";
    } else {
        Swal.fire({
            icon: "error",
            title: "Incomplete",
            text: "Please enter a valid food and serving(g).",
        });
    }
}

function addCustomFoodToMyFoods() {
    const foodName = document.getElementById("foodName").value;
    const calories = parseInt(document.getElementById("calories").value);
    const carbs = parseInt(document.getElementById("carbs").value);
    const proteins = parseInt(document.getElementById("proteins").value);
    const fats = parseInt(document.getElementById("fats").value);

    if (foodName && !isNaN(calories) && !isNaN(carbs) && !isNaN(proteins) && !isNaN(fats)) {
        // find para checkear por nuevo food
        const existingFood = myFoods.find((food) => food.name === foodName);
        if (!existingFood) {
            const food = new constructora(foodName, calories, carbs, proteins, fats);
            myFoods.push(food);
            displayMyFoods();
            saveMyFoodsToLocalStorage();
        }
        clearCustomFoodForm();
    } else {
        alert("Please fill in all fields.");
    }
}

function addMyFoodsToMeal(meal) {
    const selectedFoodName = myFoodsLists[meal].value;
    if (selectedFoodName) {
        const selectedFood = myFoods.find((food) => food.name === selectedFoodName);
        if (selectedFood) {
            meals[meal].push(selectedFood);
            displayMealFoods(meal);
            updateMealTotals(meal);
        }
    }
}

function displayMealFoods(meal) {
    const mealList = mealLists[meal];
    mealList.innerHTML = "";
    for (let i = 0; i < meals[meal].length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = `${meals[meal][i].name}`;
        mealList.appendChild(listItem);
    }
}

function displayMyFoods() {
    for (const meal in myFoodsLists) {
        myFoodsLists[meal].innerHTML = "";
    }

    for (let i = 0; i < myFoods.length; i++) {
        for (const meal in myFoodsLists) {
            const option = document.createElement("option");
            option.text = myFoods[i].name;
            myFoodsLists[meal].add(option);
        }
    }
}

function updateMealTotals(meal) {
    let totalCal = 0;
    let totalC = 0;
    let totalP = 0;
    let totalF = 0;

    for (const food of meals[meal]) {
        totalCal += food.calories;
        totalC += food.carbs;
        totalP += food.proteins;
        totalF += food.fats;
    }

    mealCalories[meal].textContent = totalCal.toFixed(1);
    mealCarbs[meal].textContent = totalC.toFixed(1);
    mealProteins[meal].textContent = totalP.toFixed(1);
    mealFats[meal].textContent = totalF.toFixed(1);

    updateDayCalories();
}

function clearCustomFoodForm() {
    document.getElementById("foodName").value = "";
    document.getElementById("calories").value = "";
    document.getElementById("carbs").value = "";
    document.getElementById("proteins").value = "";
    document.getElementById("fats").value = "";
}

function saveMyFoodsToLocalStorage() {
    localStorage.setItem("myFoods", JSON.stringify(myFoods));
}

function updateDayCalories() {
    let totalCal = 0;
    let totalC = 0;
    let totalP = 0;
    let totalF = 0;

    for (const meal in meals) {
        for (const food of meals[meal]) {
            totalCal += food.calories;
            totalC += food.carbs;
            totalP += food.proteins;
            totalF += food.fats;
        }
    }

    document.getElementById("breakfastCalories").textContent = mealCalories.breakfast.textContent;
    document.getElementById("lunchCalories").textContent = mealCalories.lunch.textContent;
    document.getElementById("dinnerCalories").textContent = mealCalories.dinner.textContent;
    document.getElementById("snacksCalories").textContent = mealCalories.snacks.textContent;

    // update try 34 de los totals, ella sigue sin quererme
    document.getElementById("totalCalories").textContent = totalCal.toFixed(1);
    document.getElementById("totalCarbs").textContent = totalC.toFixed(1);
    document.getElementById("totalProteins").textContent = totalP.toFixed(1);
    document.getElementById("totalFats").textContent = totalF.toFixed(1);
}

updateDayCalories();

document.addEventListener("DOMContentLoaded", () => {
    loadFoodOptions();
});

//async fn y promesas con fetch para cargar food options de archivo local .JSON
async function loadFoodOptions() {
    try {
        const response = await fetch("../data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Inyectar las opciones de alimentos
        const foodSelect = document.getElementById("foodSelect");
        data.forEach((food) => {
            const option = document.createElement("option");
            option.value = food.name;
            option.text = food.name;
            foodSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching food options:", error);
    }
}

