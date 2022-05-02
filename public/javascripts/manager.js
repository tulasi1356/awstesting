
function check(details,id) {
    // data=JSON.parse(details)
    var formElement = document.getElementById('fromelement')
    const formData = new FormData();
    // Object.keys(data).forEach(key => formData.append(key, data[key]));
    document.getElementById('add'+id).innerHTML = 'Added';
    var input=document.createElement('input');
    input.type="hidden";
    input.name="employee"
    input.value = details;
    formElement.appendChild(input);
    
}