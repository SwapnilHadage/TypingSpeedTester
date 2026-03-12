import { levelWiseSentences, randomSentences } from "./data.js";

const typeArea = document.querySelector(".typeArea");
let userText = document.querySelector("textarea");
const resultDiv = document.querySelector(".result")
const accuracy = document.querySelector('#acc'); //Result - Accuracy
const speed = document.querySelector('#speed');    //Result - Speed
let cursor = document.createElement("span");
cursor.classList.add("cursor");
cursor.classList.add("stop");
const wordEndChars = ['\u00A0', '.', ',', ';', ':', '!', '?', '"', "'", '(', ')', '{', '}', '[', ']', '/'];
let sentence;
let spans = [];
let firstInput;
let prevLen;
let words;
let freeStyle = false;  //default value...
let duration = 30;      //default value...
let RAF_id = null;
let correctLetterCount=0;
let selectedBtn = document.querySelector('#b1'); //default selected btn..
const btns = document.querySelectorAll(".btns");
const btnVals = ["30s", "60s", "120s", "FreeStyle"];
let begin = ()=>{
  userText.focus();
}

setInitialState(freeStyle);

typeArea.addEventListener("click", begin);
userText.addEventListener("input",startTest);
document.querySelector("#reset").addEventListener("click", setInitialState);

for( const btn of btns){
  if(btn.textContent === "Reset") continue;
  btn.addEventListener("click", (e) => {
    console.log(btn.textContent);
    
    btn.classList.add('selected');
    for (const b of btns) {
      if (btn !== b) b.classList.remove("selected");
    }

    selectedBtn = btn;
    let maxTime = selectedBtn.textContent;
    if (btn.id === 'b4') {
      freeStyle = true;
      duration = 0;
    }else{
      maxTime = maxTime.slice(0,maxTime.length-1);
      maxTime = Number(maxTime);
      console.log(maxTime);
      duration = maxTime;
      freeStyle = false;
    }
    setInitialState(freeStyle);
    userText.focus();
  }
);
}

function startTest(){
  if(firstInput){
    startTimer(duration, selectedBtn, freeStyle);
    firstInput = false;
  }

  if(userText.value.length <= sentence.length && userText.value.length > 0){
      prevLen = Math.max(0, userText.value.length - 1);
    }else{
      if( !firstInput && userText.value === '' ){
          return;
        }
    }

  const typedChar = userText.value[prevLen];
  
  if(typedChar === ' '){
    ++words;
    }
    
  if( typedChar === spans[prevLen].textContent){
    spans[prevLen].classList.add("correct");
    correctLetterCount++;
  }else{
    spans[prevLen].classList.add("incorrect");
  }
  updateCursor(prevLen);
}

function startTimer(maxTime, btn, freeStyle) {
    const startTime = performance.now();

    if(freeStyle){
      function updateTimer(time){
        const timePassed = (time - startTime)/1000;
        const remainingTime = Math.max(0, Math.floor(timePassed));
        btn.textContent = `${remainingTime}s`;
        if(userText.value.length === sentence.length) {
          typeArea.removeEventListener("click", begin);
          userText.removeEventListener("input", startTest);
          userText.disabled = true;
          if (userText.value.length === sentence.length && sentence.at(-1) === ' ') {
            words++;
          }
          showResult(words, timePassed, correctLetterCount, sentence.length);
          return
        }else{
          RAF_id = requestAnimationFrame(updateTimer);
          }
      }

      RAF_id = requestAnimationFrame(updateTimer);
    }else{
      function updateTimer(time){
      const timePassed = (time - startTime)/1000;
      const remainingTime = Math.max(0, Math.ceil(maxTime - timePassed));
      btn.textContent = `${remainingTime}s`;
      if(remainingTime === 0 || userText.value.length === sentence.length) {
        typeArea.removeEventListener("click", begin);
        userText.removeEventListener("input", startTest);
        userText.disabled = true;
        if (userText.value.length === sentence.length && sentence.at(-1) === ' ') {
            words++;
          }
        showResult(words, timePassed, correctLetterCount, sentence.length);
        return
      }else{
        RAF_id = requestAnimationFrame(updateTimer);
        }
      }
      RAF_id = requestAnimationFrame(updateTimer);
    }
    
  }

function updateCursor(idx){
    if (!spans[idx]) {
      return;
    }
    const parent = typeArea.getBoundingClientRect(); // textArea dimensions
    const char = spans[idx].getBoundingClientRect(); //spans[idx] dimensions
    cursor.style.left = `${char.left - parent.left}px`;
    cursor.style.top = `${char.top - parent.top + char.height}px`;
    cursor.style.height = `${3}px`;
    cursor.style.width = `7px`;
  }

function showResult(words, time, correctLetterCount, len){
  resultDiv.classList.add("show");
  speed.innerText = "Speed: "+`${(words*60/(time)).toFixed(2)}`;
  console.log(speed.innerText);

  accuracy.innerText = "Accuracy: "+`${(correctLetterCount*100/len).toFixed(2)}`;
  console.log(accuracy.innerText);
    
  }

function setInitialState (FreeStyle){
  typeArea.removeEventListener("click", begin);
  userText.removeEventListener("input", startTest);

  typeArea.addEventListener("click", begin);
  userText.addEventListener("input", startTest);

    btns.forEach((node, i) => {
      node.textContent = btnVals[i];
    });
    correctLetterCount = 0;
    freeStyle = FreeStyle;
    userText.disabled = false;
    firstInput =true;
    words = 0;
    resultDiv.classList.remove("show");
    speed.innerText = "Speed: 00.0";
    accuracy.innerText = "Accuracy: 00.0";
    
    userText.focus();
    
    typeArea.classList.add("before-typing");
    sentence = "";
    userText.value = "";
    if(RAF_id){
      cancelAnimationFrame(RAF_id);
      RAF_id = null;
    }

    spans = [];
    const divs = [];
    typeArea.textContent = ''
    
    sentence = randomSentences[Math.floor(Math.random()*randomSentences.length)];
    sentence.split("").forEach(char => {
      const span = document.createElement("span")

      if(char === " "){
        // span.classList.add("space");
        span.innerText = "\u00A0";
        spans.push(span);
      }else{
        span.innerText = char;
        spans.push(span);
      }
      })

    let div = document.createElement("div");

    spans.forEach((span, i)=>{
      if(wordEndChars.includes(span.textContent) || i === sentence.length-1){
        div.appendChild(span);
        divs.push(div);
        div = document.createElement("div");
      }else{
        div.appendChild(span);
      }
    })
    divs.forEach(div => {
      typeArea.appendChild(div);
    })
    typeArea.appendChild(cursor);
    updateCursor(0);
}