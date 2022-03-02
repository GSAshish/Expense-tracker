"use strict";
// Elements
const form = document.querySelector(".form");
const nametxt = document.querySelector("#addName");
const valuetxt = document.querySelector("#addValue");
const submitBtn = document.querySelector("#submit");
const statusEl = document.getElementById("status");
const togglestatustxt = document.querySelector("#toggleStatus");
const details = document.querySelector(".details");
const totalIncomeEl = document.querySelector("#totalIncome");
const totalExpenseEl = document.querySelector("#totalExpense");
const TotalammountEl = document.querySelector("#text");
const ExpensePercentageEl = document.querySelector("#expencePercentage");
// Variables
let status = "income";

// *************************************************************************************************************************************************
// Main functions
// *************************************************************************************************************************************************

let datas = [];
let totalIncome = 0;
let totalExpense = 0;
let totalammount = 0;

//functions
const numtocurrency = function (el) {
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(el);
};
const init = function () {
  let newdatas = localStorage.getItem("mykey");
  // console.log(newdatas);
  if (newdatas !== null) {
    datas = JSON.parse(newdatas);
    console.log(datas);
    let id = "";
    let status = "";
    let type = "";
    let name = "";
    let value = 0;

    // tileid: id,
    // tilename: name,
    // tilevalue: value,
    // tiletype: type,
    // tilestatus: status,
    datas.forEach(function (data) {
      id = data["tileid"];
      name = data["tilename"];
      status = data["tilestatus"];
      value = data["tilevalue"];
      type = data["tiletype"];
      let element;
      updateDIsplay(value, status);
      if (status === "income") {
        element = `<div tileid="${id}" class="${status}-tile invidual_tile" id="${type}">
      <div class="name">${name}</div>
      <div class="ammount">${numtocurrency(value)}</div>
      <button class="close" id="close">X</button>
      </div>`;
      } else {
        element = `<div tileid="${id}" class="${status}-tile invidual_tile" id="${type}">
      <div class="name">${name}</div>
      <div class="ammount">${numtocurrency(value)}</div>
      
      <button class="close" id="close">X</button>
      </div>`;
      }
      details.insertAdjacentHTML("beforeend", element);
    });
  }
};

const deleteUIdisplay = function (e, datas) {
  const Eltileid = e.getAttribute("tileid");
  let index = 0;
  datas.forEach(function (data) {
    if (data["tileid"] === Eltileid) {
      updateDIsplay(data["tilevalue"], data["tilestatus"], "delete");
      datas.splice(index, 1);
    }
    index += 1;
  });
  localStorage.setItem("mykey", JSON.stringify(datas));
};
class Profile {
  constructor(datas) {
    this.datas = datas;
  }
  updateData(name, data, status) {
    let value = status === "income" ? parseInt(data) : -parseInt(data);
    let type = status === "income" ? "inc" : "exp";
    let id = "id" + Math.random().toString(16).slice(2);
    this.datas.push({
      tileid: id,
      tilename: name,
      tilevalue: value,
      tiletype: type,
      tilestatus: status,
    });
    console.log(datas);
    updateDIsplay(value, status);
    let element = "";
    if (status === "income") {
      element = `<div tileid="${id}" class="${status}-tile invidual_tile" id="${type}">
    <div class="name">${name}</div>
    <div class="ammount">${numtocurrency(value)}</div>
    <button class="close" id="close">X</button>
    </div>`;
    } else {
      element = `<div tileid="${id}" class="${status}-tile invidual_tile" id="${type}">
    <div class="name">${name}</div>
    <div class="ammount">${numtocurrency(value)}</div>
    
    <button class="close" id="close">X</button>
    </div>`;
    }
    details.insertAdjacentHTML("beforeend", element);
    // local storage
  }
}

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(status);
  if (nametxt.value !== "" && valuetxt.value !== "") {
    const p = new Profile(datas);
    p.updateData(nametxt.value, valuetxt.value, status);
    nametxt.value = valuetxt.value = "";
    nametxt.focus();
    localStorage.setItem("mykey", JSON.stringify(datas));
  } else {
    alert("enter all feild values");
  }
});
const changeInputColor = function (status) {
  if (status === "expense") {
    nametxt.classList.add("red-focus");
    valuetxt.classList.add("red-focus");
    submitBtn.classList.add("red-focus");
  } else {
    nametxt.classList.remove("red-focus");
    valuetxt.classList.remove("red-focus");
    submitBtn.classList.remove("red-focus");
  }
};
// updating status
statusEl.addEventListener("change", function (e) {
  status = statusEl.checked === true ? "expense" : "income";
  togglestatustxt.setAttribute("status", status);
  togglestatustxt.textContent = status;
  // changing color of input and btn when status is expense
  changeInputColor(status);
});
// handling close
details.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("close")) {
    e.target.parentNode.remove();
  }
  deleteUIdisplay(e.target.parentNode, datas);
  console.log(datas);
});

// updating text content
const ChangeTextcontent = function (element, value) {
  element.textContent = value;
};
// updating display
function updateDIsplay(value, status) {
  if (status === "income") totalIncome += value;
  else -(totalExpense += value);

  let expensepercentage = 0;
  // totalammount calculation
  totalammount = totalIncome;
  totalammount += totalExpense;
  // expense percentage calculation
  expensepercentage =
    totalIncome !== 0
      ? (-(totalExpense / totalIncome) * 100).toFixed(2)
      : (totalExpense / 1).toFixed(2);
  // updating text content
  totalIncomeEl.textContent = numtocurrency(totalIncome);
  totalExpenseEl.textContent = numtocurrency(totalExpense);
  TotalammountEl.textContent = numtocurrency(totalammount);
  ExpensePercentageEl.textContent = expensepercentage + "%";
}
function updateDIsplay(value, status, changed) {
  if (changed === "delete") {
    if (status === "income") totalIncome -= value;
    else -(totalExpense -= value);
  } else {
    if (status === "income") totalIncome += value;
    else -(totalExpense += value);
  }

  let expensepercentage = 0;
  // totalammount calculation
  totalammount = totalIncome;
  totalammount += totalExpense;
  // expense percentage calculation
  expensepercentage =
    totalIncome !== 0
      ? (-(totalExpense / totalIncome) * 100).toFixed(2)
      : (totalExpense / 1).toFixed(2);
  // updating text content
  totalIncomeEl.textContent = numtocurrency(totalIncome);
  totalExpenseEl.textContent = numtocurrency(totalExpense);
  TotalammountEl.textContent = numtocurrency(totalammount);
  ExpensePercentageEl.textContent = expensepercentage + "%";
}
init();
