const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update exchange rate
const updateExchangeRate = async () => {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }
        const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}`;
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        let rate = data.rates[toCurr.value];
        if (rate === undefined) {
            throw new Error('Invalid currency code');
        }

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
};

// Function to update currency flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

// Event listener for button click
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Initial update on page load
window.addEventListener("load", () => {
    updateExchangeRate();
});
