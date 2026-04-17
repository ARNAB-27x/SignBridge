







let themebt = document.querySelector("#theme");
let main = document.querySelector("#main");
let eye1=document.querySelector("#eye1");
eyeo=0;
let eye2=document.querySelector("#eye2");
eyet=0;
let cpass=document.querySelector("#cpass");







let pass=document.querySelector("#pass");
let theme = localStorage.getItem("theme") || "light";
let pa=document.querySelector("#pa");
let cpa=document.querySelector("#cpa");
let warning=document.createElement("p");
let warning2=document.createElement("p");
warning.classList.add("text-red-600");
warning2.classList.add("text-red-600");
let ea=document.querySelector("#ea");
btns=document.querySelector("#btns");
email=document.querySelector("#em");
let warning3=document.createElement("p");
warning3.classList.add("text-red-600");

function checkForm(){

let passvalue = pass.value;
let passvalue1 = cpass.value;
let emailvalue=email.value;

let validPass = passvalue.length >= 8 &&
                /[A-Z]/.test(passvalue) &&
                /[0-9]/.test(passvalue) &&
                /[!@#$%^&*]/.test(passvalue)  ;

let validemail=/@gmail\.com$/.test(emailvalue);
let matchPass = passvalue === passvalue1;


if(validPass && matchPass && validemail){
    btns.disabled = false;
}

else{
    btns.disabled = true;
}

}
if(email){
email.addEventListener("input",function(){
let emailvalue=email.value;
ea.append(warning3);
if(!/@gmail\.com$/.test(emailvalue)){
    warning3.innerText = "Enter a valid Gmail address";

    email.classList.remove('focus:ring-[#6a11cb]');
    email.classList.add('focus:ring-red-400');
}
else{
    email.classList.remove('focus:ring-red-400');
    email.classList.add('focus:ring-[#6a11cb]');
    warning3.innerText = "";
}
checkForm();
});}


if(pass){
pass.addEventListener("input",function(){
let passvalue=pass.value;
pa.append(warning);
if(passvalue.length<8 || (!/[A-Z]/.test(passvalue)) || (!/[0-9]/.test(passvalue)) || (!/[!@#$%^&*]/.test(passvalue))){
    warning.innerText='Password must contain at least one uppercase, lowercase,number, and special character';
  pass.classList.remove('focus:ring-[#6a11cb]');
  pass.classList.add('focus:ring-red-400');
  
}
else{
    pass.classList.remove('focus:ring-red-400');
    pass.classList.add('focus:ring-[#6a11cb]');
    warning.innerText=null;
    
}
checkForm();
});}
if(cpass){
cpass.addEventListener("input",function(){
    let passvalue=pass.value;
let passvalue1=cpass.value;
cpa.append(warning2);
if(passvalue1!==passvalue){
    warning2.innerText='password does not match';
cpass.classList.remove('focus:ring-[#6a11cb]');
  cpass.classList.add('focus:ring-red-400');
  
}
else{
     cpass.classList.remove('focus:ring-red-400');
    cpass.classList.add('focus:ring-[#6a11cb]');
    warning2.innerText=null;
   
}
checkForm();
});}
applyTheme();

function changetheme(){
    if(theme === "dark"){
        theme = "light";
    } else {
        theme = "dark";
    }

    localStorage.setItem("theme", theme);
    applyTheme();
}

function applyTheme(){
    if(theme === "dark"){

        themebt.innerHTML="<path stroke-linecap='round' stroke-linejoin='round' d='M21 12.79A9 9 0 0111.21 3a7 7 0 108.79 9.79z'/>";

        themebt.classList.remove("text-yellow-400");
        themebt.classList.add("text-gray-400");

        main.classList.remove("bg-[url('/static/images/pexels-codioful-7130536.jpg')]");
        main.classList.add("bg-[url('/static/images/dark.jpg')]");

    } 
    else {

        themebt.innerHTML="<circle cx='12' cy='12' r='5'></circle> <line x1='12' y1='1' x2='12' y2='3'></line> <line x1='12' y1='21' x2='12' y2='23'></line> <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line> <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line> <line x1='1' y1='12' x2='3' y2='12'></line> <line x1='21' y1='12' x2='23' y2='12'></line> <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line> <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>";

        themebt.classList.remove("text-gray-400");
        themebt.classList.add("text-yellow-400");

        main.classList.remove("bg-[url('/static/images/dark.jpg')]");
        main.classList.add("bg-[url('/static/images/pexels-codioful-7130536.jpg')]");

    }
}
function changeeye1(){
 if (eyeo===0){
    eye1.innerHTML="<path stroke-linecap='round' stroke-linejoin='round' d='M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z'/> <circle cx='12' cy='12' r='3'></circle>";
    pass.type="text";
    eyeo=1;
 }
 else{
    eye1.innerHTML="<path stroke-linecap='round' stroke-linejoin='round' d='M3 3l18 18'/> <path stroke-linecap='round' stroke-linejoin='round' d='M10.58 10.58a3 3 0 004.24 4.24'/> <path stroke-linecap='round' stroke-linejoin='round' d='M9.88 4.24A10.94 10.94 0 0112 4.5c6 0 10.5 7.5 10.5 7.5a18.24 18.24 0 01-3.17 4.22M6.1 6.1C3.77 7.94 1.5 12 1.5 12s4.5 7.5 10.5 7.5c1.61 0 3.12-.34 4.47-.94'/>";
    pass.type="password";
    eyeo=0;
 }
}
function changeeye2(){
 if (eyet===0){
    eye2.innerHTML="<path stroke-linecap='round' stroke-linejoin='round' d='M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z'/> <circle cx='12' cy='12' r='3'></circle>";
    cpass.type="text";
    eyet=1;
    
 }
 else{
    eye2.innerHTML="<path stroke-linecap='round' stroke-linejoin='round' d='M3 3l18 18'/> <path stroke-linecap='round' stroke-linejoin='round' d='M10.58 10.58a3 3 0 004.24 4.24'/> <path stroke-linecap='round' stroke-linejoin='round' d='M9.88 4.24A10.94 10.94 0 0112 4.5c6 0 10.5 7.5 10.5 7.5a18.24 18.24 0 01-3.17 4.22M6.1 6.1C3.77 7.94 1.5 12 1.5 12s4.5 7.5 10.5 7.5c1.61 0 3.12-.34 4.47-.94'/>";
    cpass.type="password";
    eyet=0;
 }
}


document.addEventListener("DOMContentLoaded", function(){

    let option = new URLSearchParams(window.location.search);
    let noti = option.get("noti");

    if(noti === "exists"){
        notification("Email already exists");
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    else if(noti==="wrong"){
     notification("wrong credentials! \nNo account found");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
   
    else if(noti==="addedtask"){
     notification("Task Added Successfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    

    else if(noti==="false"){
     notification("False Entry");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    else if(noti==="editedtask"){
        notification("Edited Task Succesfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
    
    }
    else if(noti==="addedgoal"){
        notification("Goal Added Succesfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
    
    }
     else if(noti==="editedgoal"){
        notification("Edited Goal Succesfully!");
        window.history.replaceState({}, document.title, window.location.pathname);}
    
    else if(noti==="devpls"){
        notification("wrong password!");
        window.history.replaceState({}, document.title, window.location.pathname);}    
});








let toastTimeout;

function notification(message){
    let toast = document.querySelector("#toast");

    toast.innerText = message;

    
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("translate-x-full", "opacity-0");

    
    toast.offsetHeight;

    
    toast.classList.remove("translate-x-full", "opacity-0");
    toast.classList.add("translate-x-0", "opacity-100");

    
    startAutoClose(toast);

   
    toast.onmouseenter = function(){
        clearTimeout(toastTimeout);
    };

    
    toast.onmouseleave = function(){
        startAutoClose(toast);
    };
}

function startAutoClose(toast){
    toastTimeout = setTimeout(function(){
        toast.classList.remove("translate-x-0", "opacity-100");
        toast.classList.add("translate-x-full", "opacity-0");
    }, 4000);
}




if(themebt){
themebt.addEventListener("click", changetheme);}
if(eye1){
eye1.addEventListener("click",changeeye1);}
if(eye2){
eye2.addEventListener("click",changeeye2);}











document.addEventListener("DOMContentLoaded", function() {

    let profile = document.querySelector("#profile");
    let isprofile = document.querySelector("#isprofile");

    let dropdown = null;
    let q = 0;

    isprofile.addEventListener("click", function() {

        if (q === 0) {

            dropdown = document.createElement("div");

            dropdown.classList.add(
                "absolute", "right-0", "top-full", "mt-2",
                "w-44", "bg-[#1e293b]", "border",
                "border-gray-700", "rounded-lg",
                "shadow-lg", "py-2", "z-50"
            );

            dropdown.innerHTML = `
                <a class='block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-300' href='/viewprofile.html'>View Profile</a>
                <a class='block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-300' href='/editprofile.html'>Edit Profile</a>
                <a class='block px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300' href='/login.html'>Logout</a>
            `;

            profile.appendChild(dropdown);
            q = 1;

        } else {

            if (dropdown) dropdown.remove();
            q = 0;
        }
    });

});




const video = document.getElementById("webcam");

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } 
    catch (error) {
        console.log("Error accessing webcam:", error);
    }
}

if (video) {
    startWebcam();
}











