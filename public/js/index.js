async function loadNames() {
    const response = await fetch('/data');
    const names = await response.json();
    var len = Object.keys(names).length;
    let no_floors = 0;
    let array = [];
    for(let z = 0; z < len; z++) {
        var arr_floors = Number(names[z]['floor']);
        array.push(arr_floors);
        if(no_floors < Number(names[z]['floor'])) {
            no_floors = Number(names[z]['floor']);
        }
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    var unique = array.filter(onlyUnique);
    unique.sort();

    var main = document.getElementsByClassName('main')[0];
    main.innerHTML='';
    while(true) {
        for(let p = 0; p < unique.length; p++) {
            var div1 = document.createElement('div');
            div1.className="container mb-4";
            var div2 = document.createElement('div');
            div2.className="mb-4 floor";
            var floor_value = "Floor-"+unique[p];  
            div2.innerHTML=floor_value;
            div1.append(div2);
            var div3 = document.createElement('div');
            div3.className="row";
            div2.after(div3);

        for(let q = 0; q < len; q++) {
            if(unique[p] === Number(names[q]['floor'])) {
                var a = document.createElement('a');
                a.className="btn-social";
                a.href="javascript:void(0);";
                if(names[q]['status'] == 1) {
                    a.style.backgroundColor="#28a745";
                }
                else if(names[q]['status'] == 0) {
                    a.style.backgroundColor="#dc3545";
                }
                else {
                    a.style.backgroundColor="#6c757d";
                }
                div3.append(a);
                var i = document.createElement('i');
                i.className="fa-solid fa-recycle";
                a.append(i);
                var span = document.createElement('span');
                span.className="span-g";
                span.innerHTML="G"+names[q]['garbage'];
                i.after(span);
            }
        }
        main.append(div1);
    }
        break;
    }
    let counter = 1;
    var tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    for(let s = 0; s < len; s++) { 
        if(names[s]['status'] == 0) {
            var tr = document.createElement('tr');
            tbody.append(tr);
            var td1 = document.createElement('td');
            td1.innerHTML=counter;
            counter++;
            tr.append(td1);
            var td2 = document.createElement('td');
            td2.innerHTML=names[s]['floor'];
            td1.after(td2);
            var td3 = document.createElement('td');
            td3.innerHTML=names[s]['garbage'];
            td2.after(td3);
            var td4 = document.createElement('td');
            td4.innerHTML=names[s]['status'];
            td3.after(td4);
        }
    }
}
setInterval( () => {
loadNames();
},10000);
loadNames();
