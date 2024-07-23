const itemForm= document.getElementById('item-form');
const itemInput= document.getElementById('item-input');
const itemList= document.getElementById('item-list');
const clearBtn= document.getElementById('clear');
const filter= document.getElementById('filter');
const formBtn=itemForm.querySelector('button');

let isEditMode = false;


function displayItems(){
    const itemsFromStorage= getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));

    checkUI();
}


function onAddItemSubmit(e){
    e.preventDefault();
    const newItem= itemInput.value;
    if(newItem ===''){
        alert('Please enter an item');
        return;
    }

    if (isEditMode){
        const itemToEdit= itemList.querySelector('.edit-mode');

        if(checkItemIfExist(newItem) && itemToEdit.textContent.trim() !==newItem){
            alert("Item already exist!");
            return;
        }
        
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
   

        itemToEdit.remove();

        isEditMode=false;

    }else{
        if (checkItemIfExist(newItem)){
            alert('Item already exist');
            return;
        }
    }
    
    addItemToDom(newItem);

    addItemToStorage(newItem);
    
    checkUI();
    
    itemInput.value='';
}
function addItemToDom(item){
    const li= document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button=createButton('remove-item btn-link text-red');
    li.appendChild(button);
    
    itemList.appendChild(li);
    
 }

 function createButton(classes){
         const button= document.createElement('button');
         button.className=classes;
         const icon=createIcon('fa-solid fa-xmark');
         button.appendChild(icon);
         return button;
     }
function createIcon(classes){
        const icon= document.createElement('i');
        icon.className=classes;
        return icon;
    }
function addItemToStorage(item){
    const itemsFromStorage= getItemFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items')===null){
        itemsFromStorage= [];
        }else{
            itemsFromStorage= JSON.parse(localStorage.getItem('items'));
            }

        return itemsFromStorage;
}
    

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item){
    isEditMode=true;
    
    itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove('edit-mode'));
    
    item.classList.add("edit-mode");

    formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value=item.textContent;
}

function removeItem(item){
   if (confirm("Are you sure?")){
    item.remove();

    removeItemFromStorage(item.textContent);

    checkUI();
   }
  
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage();
    itemsFromStorage=itemsFromStorage.filter(i => i !==item);
    
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}
function clearItem(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);

        localStorage.removeItem("items");
        checkUI();
    }
}
function checkItemIfExist(item){
    let itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item.trim());
    }

function filterItem(){
    const items= itemList.querySelectorAll('li');
    const text= filter.value.toLowerCase();
    
   items.forEach(function(item){
    const itemText= item.firstChild.textContent.toLowerCase();
    if(itemText.indexOf(text) !=-1){
        item.style.display='flex';
    }
    else{
        item.style.display='none';
                
        }
    });
};


function checkUI(){
    const items= itemList.querySelectorAll('li');
    if (items.length ===0){
        clearBtn.style.display='none';
        filter.style.display='none';
    }else{
        clearBtn.style.display='block';
        filter.style.display='block';
    }

    formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor=' #333';
    formBtn.style.color='#fff';
    
   
    isEditMode=false;
}



itemForm.addEventListener('submit',onAddItemSubmit);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItem);
filter.addEventListener('input',filterItem);
document.addEventListener("DOMContentLoaded", displayItems);


checkUI();
