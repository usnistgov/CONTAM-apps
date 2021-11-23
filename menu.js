
var menuModule = {};

// when the use clicks on the menu image create and show the menu
// unless the menu already exists in which case close the menu
menuModule.menuClick = function(ev)
{
  //check if menu exists 
  var existingMenu = document.getElementById("pagesMenu");
  if(existingMenu != undefined)
  {
    //if so close the menu and return
    menuModule.menuClose();
    return;
  }

  // get the menu icon
  var menuImage = document.getElementById("menuImage");
  // if it does not exist then return
  if(menuImage == undefined)
    return;
  
  // get the bounding box of the menu icon
  var rect = menuImage.getBoundingClientRect();
    
  // create the menu
  var menu = document.createElement("NAV");
  menu.id = "pagesMenu";
  menu.style.position = "absolute";
  menu.style.border = "solid thin #12659c";
  menu.style.backgroundColor = "#e4f2fc";
  menu.style.marginRight = "2px";
  menu.style.width = "300px";
  menu.style.right = "0px";
  menu.style.top = (rect.top + rect.height) + "px";
  
  var topdiv = document.createElement("DIV");
  
  var link1 = document.createElement("A");
  link1.textContent = "Multizone Modeling";
  link1.href = "https://www.nist.gov/el/energy-and-environment-division-73200/nist-multizone-modeling";
  link1.className = "blacklink";
  topdiv.appendChild(link1);
  
  topdiv.appendChild(document.createTextNode(" "));
  var span = document.createElement("SPAN");
  // add a Double Right-Pointing Angle Quotation Mark (&raquo;)
  span.textContent = String.fromCharCode(187);
  topdiv.appendChild(span);
  topdiv.appendChild(document.createTextNode(" "));
  
  var link2 = document.createElement("A");
  link2.textContent = "Software Page";
  link2.href = "https://www.nist.gov/el/energy-and-environment-division-73200/nist-multizone-modeling/software-tools";
  link2.className = "blacklink";
  topdiv.appendChild(link2);
  
  topdiv.style.borderBottom = "solid thin #12659c";
  topdiv.style.padding = "1ex";
  menu.appendChild(topdiv);
  
  var link3 = document.createElement("A");
  link3.textContent = "Climate Suitability Tool";
  link3.href = "https://pages.nist.gov/CONTAM-apps/software/CSTWebprogram.htm";
  link3.className = "blacklink";
  link3.style.display = "block";
  link3.style.padding = "1ex";
  menu.appendChild(link3);
    
  var link4 = document.createElement("A");
  link4.textContent = "CONTAM Results Export Tool";
  link4.href = "https://pages.nist.gov/CONTAM-apps/webapps/contam_results_exporter/index.htm";
  link4.className = "blacklink";
  link4.style.display = "block";
  link4.style.padding = "1ex";
  menu.appendChild(link4);
  
  var link5 = document.createElement("A");
  link5.textContent = "CONTAM Particle Distribution Calculator";
  link5.href = "https://pages.nist.gov/CONTAM-apps/software/CPDC/index.htm";
  link5.className = "blacklink";
  link5.style.display = "block";
  link5.style.padding = "1ex";
  menu.appendChild(link5);
  
  var link6 = document.createElement("A");
  link6.textContent = "CONTAM Weather Tool";
  link6.href = "https://pages.nist.gov/CONTAM-apps/webapps/WeatherTool/index.htm";
  link6.className = "blacklink";
  link6.style.display = "block";
  link6.style.padding = "1ex";
  menu.appendChild(link6);
  
  var link7 = document.createElement("A");
  link7.textContent = "Engineered Nanoparticle Airborne Exposure Tool";
  link7.href = "https://pages.nist.gov/CONTAM-apps/webapps/NanoParticleTool/index.htm";
  link7.className = "blacklink";
  link7.style.display = "block";
  link7.style.padding = "1ex";
  menu.appendChild(link7);

  var nextLink = document.createElement("A");
  nextLink.textContent = "FaTIMA";
  nextLink.href = "https://pages.nist.gov/CONTAM-apps/webapps/FaTIMA";
  nextLink.className = "blacklink";
  nextLink.style.display = "block";
  nextLink.style.padding = "1ex";
  menu.appendChild(nextLink);
  
  var link8 = document.createElement("A");
  link8.textContent = "Nanoparticle Coagulation Tool";
  link8.href = "https://pages.nist.gov/CONTAM-apps/webapps/coag/index.htm";
  link8.className = "blacklink";
  link8.style.display = "block";
  link8.style.padding = "1ex";
  menu.appendChild(link8);
  
  var link9 = document.createElement("A");
  link9.textContent = "ViPER";
  link9.href = "https://pages.nist.gov/CONTAM-apps/webapps/ViPER";
  link9.className = "blacklink";
  link9.style.display = "block";
  link9.style.padding = "1ex";
  menu.appendChild(link9);

  document.body.appendChild(menu);
  
  //stop the propogation 
  // otherwise the click will bubble to the body and remove the menu
  ev.stopPropagation();
}

// when the user clicks in the body of the document 
// close the menu if it is in the document
menuModule.menuClose = function()
{
  var menu = document.getElementById("pagesMenu");
  
  if(menu == undefined)
    return;
  
  document.body.removeChild(menu);
  
}

// add event listeners on load
window.addEventListener("load", function(event) 
{
  document.getElementById("menuImage").addEventListener("click", menuModule.menuClick);
  
  document.body.addEventListener("click", menuModule.menuClose);
});
