const request = require('request');
const fs = require('fs');

var superlinks = [];
var cursor = 0;
superlinks.push('stackoverflow.com/questions/2281633/javascript-isset-equivalent');

var timestart = 0;
var timestop = 0;
let alllinks = 0;
let filenum = 0;
whiled();

function whiled() {

    console.log('['+superlinks.length+']', 'Request : '+superlinks[cursor], 'Lastspeed : '+(timestop-timestart).toFixed(2)+'ms');
    timestart = Date.now();
    request('http://'+superlinks[cursor], function (error, response, body) {
        if(response != null && response.statusCode == 200 && response.caseless.dict['content-type'].includes('text/html') == true) {
                
            let links = response.body.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi));

            if(links != null) {
                links.forEach(function(entry) {
                    const url = new URL(entry);
                        
                    var alldots = /(?:\.([^.]+))?$/.exec(url.pathname);
                    
                    var ext = alldots[alldots.length-1];
                        
                    if(ext != 'js' && ext != 'css'  && ext != 'png' && ext != 'jpg') {
                        let link = url.host + url.pathname;
                        if(superlinks.includes(link) == false) {
                            superlinks.push(link);
                            alllinks++;
                            console.log('   > '+link);
                        }
                    }
                });
            }
            timestop = Date.now();

        }
        cursor++;
        if(superlinks.length > 1010) {
            fs.writeFile(filenum+'.db', superlinks.join("\n"), function (err) {
                if (err) throw err;
                filenum++;
                superlinks.splice(0, 1000);
            });
        }
        whiled();
    });
}
