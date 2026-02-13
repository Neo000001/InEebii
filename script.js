addRow();

function addRow(){
    const row=document.createElement("tr");
    row.innerHTML=`
        <td><input oninput="calculate()"></td>
        <td><input type="number" value="1" oninput="calculate()"></td>
        <td><input type="number" value="0" oninput="calculate()"></td>
        <td><input type="number" value="18" oninput="calculate()"></td>
        <td class="rowTotal">0</td>
    `;
    document.getElementById("itemBody").appendChild(row);
    calculate();
}

function numberToWords(num){
    if(num==0) return "Zero Rupees Only";
    return num.toFixed(2)+" Rupees Only";
}

function calculate(){

    let subtotal=0,cgst=0,sgst=0,igst=0;

    const bState=document.getElementById("businessState").value.trim();
    const cState=document.getElementById("clientState").value.trim();

    const rows=document.querySelectorAll("#itemBody tr");
    const preview=document.getElementById("previewItems");
    preview.innerHTML="";

    rows.forEach(r=>{
        const desc=r.cells[0].children[0].value;
        const qty=parseFloat(r.cells[1].children[0].value)||0;
        const rate=parseFloat(r.cells[2].children[0].value)||0;
        const gst=parseFloat(r.cells[3].children[0].value)||0;

        const amt=qty*rate;
        const tax=amt*gst/100;

        r.querySelector(".rowTotal").innerText=(amt+tax).toFixed(2);

        subtotal += amt;

        if(bState && cState && bState===cState){
            cgst += tax/2;
            sgst += tax/2;
        } else {
            igst += tax;
        }

        preview.innerHTML += `
            <tr>
                <td>${desc}</td>
                <td>${qty}</td>
                <td>${rate}</td>
                <td>${(amt+tax).toFixed(2)}</td>
            </tr>`;
    });

    const grand=subtotal+cgst+sgst+igst;

    document.getElementById("previewBusiness").innerText =
        document.getElementById("businessName").value || "Business Name";

    document.getElementById("previewBusinessGST").innerText =
        "GSTIN: " + (document.getElementById("businessGST").value||"");

    document.getElementById("previewClient").innerText =
        document.getElementById("clientName").value || "Client Name";

    document.getElementById("pSubtotal").innerText=subtotal.toFixed(2);
    document.getElementById("pCgst").innerText=cgst.toFixed(2);
    document.getElementById("pSgst").innerText=sgst.toFixed(2);
    document.getElementById("pIgst").innerText=igst.toFixed(2);
    document.getElementById("pGrand").innerText=grand.toFixed(2);

    document.getElementById("amountWords").innerText =
        numberToWords(grand);
}

document.getElementById("downloadPdf").addEventListener("click", ()=>{
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF();
    doc.text(document.getElementById("invoicePreview").innerText,10,10);
    doc.save("invoice.pdf");
});
