function exportToCSV(fileName) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [];
    var cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) {
      var cellData = cols[j].innerText.trim();

      cellData = cellData.replace(/"/g, '""'); // escape double quotes by doubling them

      if (cellData.indexOf(",") >= 0) {
        // add double quotes around cell value if it contains commas
        cellData = '"' + cellData + '"';
      }
      row.push(cellData);
    }

    var rowString = row.join(",");
    csv.push(rowString);
  }

  csv = csv.join("\n");
  var csvBlob = new Blob([csv], { type: "text/csv" });
  var downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = window.URL.createObjectURL(csvBlob);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

export { exportToCSV };
