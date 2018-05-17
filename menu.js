
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
  menu.style.width = "400px";
  menu.style.padding = "2px";
  menu.style.right = "0px";
  menu.style.top = (rect.top + rect.height) + "px";
  
  var link1 = document.createElement("A");
  link1.textContent = "Multizone Modeling";
  link1.href = "https://www.nist.gov/el/energy-and-environment-division-73200/nist-multizone-modeling";
  link1.className = "blacklink";
  menu.appendChild(link1);
  
  menu.appendChild(document.createTextNode(" "));
  var span = document.createElement("SPAN");
  // add a Double Right-Pointing Angle Quotation Mark (&raquo;)
  span.textContent = String.fromCharCode(187);
  menu.appendChild(span);
  menu.appendChild(document.createTextNode(" "));
  
  var link2 = document.createElement("A");
  link2.textContent = "Software Page";
  link2.href = "https://www.nist.gov/el/energy-and-environment-division-73200/nist-multizone-modeling/software-tools";
  link2.className = "blacklink";
  menu.appendChild(link2);
  
  menu.appendChild(document.createElement("BR"));
  
  var link3 = document.createElement("A");
  link3.textContent = "Climate Suitability Tool";
  link3.href = "https://pages.nist.gov/CONTAM-apps/software/CSTWebprogram.htm";
  link3.className = "blacklink";
  menu.appendChild(link3);
  
  menu.appendChild(document.createElement("BR"));
  
  var link4 = document.createElement("A");
  link4.textContent = "CONTAM Results Export Tool";
  link4.href = "https://pages.nist.gov/CONTAM-apps/webapps/contam_results_exporter/index.htm";
  link4.className = "blacklink";
  menu.appendChild(link4);
  
  menu.appendChild(document.createElement("BR"));
  
  var link5 = document.createElement("A");
  link5.textContent = "CONTAM Particle Distribution Calculator";
  link5.href = "https://pages.nist.gov/CONTAM-apps/software/CPDC/index.htm";
  link5.className = "blacklink";
  menu.appendChild(link5);
  
  menu.appendChild(document.createElement("BR"));
  
  var link6 = document.createElement("A");
  link6.textContent = "Engineered Nanoparticle Airborne Exposure Tool";
  link6.href = "https://pages.nist.gov/CONTAM-apps/webapps/NanoParticleTool/index.htm";
  link6.className = "blacklink";
  menu.appendChild(link6);

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
