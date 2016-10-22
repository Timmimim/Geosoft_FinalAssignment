/**
 * Created by timmimim on 08.09.16.
 */

/**
 * function loads external file
 * extracts data and forms a JSON element
 */
function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('loadExternalFile');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        reveived = true;
        var lines;
        newJSON = null;

        lines = e.target.result;
        newJSON = JSON.parse(lines);

        if(newJSON instanceof Array) {
            array = true;
            for (var i in newJSON) {
                upload(newJSON[i].features[0]);
            }
            array = false;
        }else{
            upload(newJSON.features[0]);
        }
    }
};
