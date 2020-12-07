var admin = require("firebase-admin");
const { uuid } = require('uuidv4');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ohtt-b836a.firebaseio.com",
  storageBucket: "gs://ohtt-b836a.appspot.com"
});

let bucket = admin.storage().bucket()
let db = admin.firestore();
let contents = db.collection('contents')
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
var probe = require('probe-image-size');

async function fileUpload(filename, file_uuid) {
  var data = require('fs').readFileSync(filename);
  const dataInfo = probe.sync(data);

  // console.log(dataInfo);
  // console.log(file_uuid);
  // console.log(dataInfo.mime);

  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: file_uuid
    },
    contentType: dataInfo.mime,
    cacheControl: 'public, max-age=31536000',
  };

  // Uploads a local file to the bucket
  let upload_filename = await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
  }).then((data) => {
    let file = data[0];

    return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + file_uuid);

    // const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
    // console.log('logging image url' + imageUrl);
    // return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
  });
  // console.log('업로드');

  return upload_filename;
}

async  function fileDownload(url, dest){
  var file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    var responseSent = false; // flag to make sure that response is sent only once.
    if(url.indexOf('https') != -1) {
      // https

      https.get(url, response => {
        response.pipe(file);
        file.on('finish', () =>{
          file.close(() => {
            if(responseSent)  return;
            responseSent = true;
            resolve();
          });
        });
      }).on('error', err => {
          if(responseSent)  return;
          responseSent = true;
          reject(err);
      });

    } else {
      // http

      http.get(url, response => {
        response.pipe(file);
        file.on('finish', () =>{
          file.close(() => {
            if(responseSent)  return;
            responseSent = true;
            resolve();
          });
        });
      }).on('error', err => {
          if(responseSent)  return;
          responseSent = true;
          reject(err);
      });

    }
  });
}

async function getJsonFile() {
  const rootFolder = './processParse';
  const jsonFils = [];

  try {
    const folder = await readdir(rootFolder);
    for ( let i = 0; i < folder.length; i++ ) {
      const files = await readdir(rootFolder+'/'+folder[i]);
      for ( let j = 0; j < files.length; j++ ) {
        jsonFils.push(rootFolder+'/'+folder[i]+"/"+files[j]);
      };
    };
  } catch (err) {
    console.log(err);

  }

  return jsonFils;
}
async function handleAsyncDelete() {  
  return bucket.deleteFiles({
    prefix: ``
  });
}

function sleep (delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

async function handleAsync() {  
  let rawdata = await fs.readFileSync('./processParse/dataProcess/dataProcess.json');
  let json = await JSON.parse(rawdata);
  // console.log(json.length);
  let complate = 0;
  for(let i = 0; i < json.length; i++) {
    let file_uuid = uuid();
    if ( 1944 <= i && i <= 2000  ) {
      // console.log(json[i]);
      // console.log("번호 : "+i)

      // poster
      // console.log('poster');      
      if ( json[i].poster ) {
        if ( json[i].poster.large ) {
          if ( json[i].poster.large.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.large.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.large, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.large 업로드2');
            // console.log(file_name);

            json[i].poster.large = file_name;
            sleep(50);
          }
        }

        if ( json[i].poster.medium ) {
          if ( json[i].poster.medium.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.medium.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.medium, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.medium 업로드2');
            // console.log(file_name);

            json[i].poster.medium = file_name;
            sleep(50);
          }
        }
        
        if ( json[i].poster.original ) {
          if ( json[i].poster.original.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.original.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.original, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.original 업로드2');
            // console.log(file_name);

            json[i].poster.original = file_name;
            sleep(50);
          }
        }
        
        if ( json[i].poster.small ) {
          if ( json[i].poster.small.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.small.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.small, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.small 업로드2');
            // console.log(file_name);

            json[i].poster.small = file_name;
            sleep(50);
          }
        }
        
        if ( json[i].poster.tizen_preview ) {
          if ( json[i].poster.tizen_preview.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.tizen_preview.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.tizen_preview, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.tizen_preview 업로드2');
            // console.log(file_name);

            json[i].poster.tizen_preview = file_name;
            sleep(50);
          }
        } 
        
        if ( json[i].poster.xlarge ) {
          if ( json[i].poster.xlarge.length != 0 ) {
            file_uuid = uuid();
            const temp = json[i].poster.xlarge.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].poster.xlarge, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].poster.xlarge 업로드2');
            // console.log(file_name);

            json[i].poster.xlarge = file_name;
            sleep(50);
          }
        }         
      }

      // credits
      // console.log('credits');      
      if ( json[i].credits ) {
        for ( let j = 0; j < json[i].credits.length; j++ ) {
          if ( json[i].credits[j].person.photo ) {
            if ( json[i].credits[j].person.photo.medium ) {
              if ( json[i].credits[j].person.photo.medium.length != 0 ) {
                file_uuid = uuid();
                const temp = json[i].credits[j].person.photo.medium.split('.');
                const temp2 = temp[temp.length - 1].split('?');
                const tempName = file_uuid+"."+temp2[0];
                // console.log(tempName);
    
                await fileDownload(json[i].credits[j].person.photo.medium, './files/'+tempName)
                .then( ()=> console.log('downloaded file no issues...'))
                .catch( e => console.error('error while downloading', e));  
    
                let file_name = await fileUpload('./files/'+tempName,file_uuid);
    
                try {
                  fs.unlinkSync('./files/'+tempName)
                  // console.log('./files/'+tempName+' remove');
                  //file removed
                } catch(err) {
                  console.error(err)
                }
    
                // console.log('json[i].credits[j].person.photo.medium 업로드2');
                // console.log(file_name);
    
                json[i].credits[j].person.photo.medium = file_name;
                sleep(50);
              }
            }

            if ( json[i].credits[j].person.photo.small ) {
              if ( json[i].credits[j].person.photo.small.length != 0 ) {
                file_uuid = uuid();
                const temp = json[i].credits[j].person.photo.small.split('.');
                const temp2 = temp[temp.length - 1].split('?');
                const tempName = file_uuid+"."+temp2[0];
                // console.log(tempName);
    
                await fileDownload(json[i].credits[j].person.photo.small, './files/'+tempName)
                .then( ()=> console.log('downloaded file no issues...'))
                .catch( e => console.error('error while downloading', e));  
    
                let file_name = await fileUpload('./files/'+tempName,file_uuid);
    
                try {
                  fs.unlinkSync('./files/'+tempName)
                  // console.log('./files/'+tempName+' remove');
                  //file removed
                } catch(err) {
                  console.error(err)
                }
    
                // console.log('json[i].credits[j].person.photo.small 업로드2');
                // console.log(file_name);
    
                json[i].credits[j].person.photo.small = file_name;
                sleep(50);
              }            
            }            
          }
        }
      }

      // badges
      // console.log('badges');
      if ( json[i].badges ) {
        for ( let j = 0; j < json[i].badges.length; j++ ) {
          if ( json[i].badges[j].image ) {
            if ( json[i].badges[j].image.length != 0 ) {
              file_uuid = uuid();
              const temp = json[i].badges[j].image.split('.');
              const temp2 = temp[temp.length - 1].split('?');
              const tempName = file_uuid+"."+temp2[0];
              // console.log(tempName);
  
              await fileDownload(json[i].badges[j].image, './files/'+tempName)
              .then( ()=> console.log('downloaded file no issues...'))
              .catch( e => console.error('error while downloading', e));  
  
              let file_name = await fileUpload('./files/'+tempName,file_uuid);
  
              try {
                fs.unlinkSync('./files/'+tempName)
                // console.log('./files/'+tempName+' remove');
                //file removed
              } catch(err) {
                console.error(err)
              }
  
              // console.log('json[i].badges[j].image 업로드2');
              // console.log(file_name);
  
              json[i].badges[j].image = file_name;
              sleep(50);
            }                     
          }          
        }
      }

      // stillcut
      // console.log('stillcut');
      if ( json[i].stillcut ) {
        if ( json[i].stillcut.fullhd ) {
          if ( json[i].stillcut.fullhd.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.fullhd.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.fullhd, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.fullhd 업로드2');
            // console.log(file_name);

            json[i].stillcut.fullhd = file_name;           
            sleep(50); 
          }
        }

        if ( json[i].stillcut.large ) {
          if ( json[i].stillcut.large.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.large.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.large, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.large 업로드2');
            // console.log(file_name);

            json[i].stillcut.large = file_name;        
            sleep(50);       
          }
        }
        
        if ( json[i].stillcut.medium ) {
          if ( json[i].stillcut.medium.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.medium.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.medium, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.medium 업로드2');
            // console.log(file_name);

            json[i].stillcut.medium = file_name;           
            sleep(50);        
          }
        }
        
        if ( json[i].stillcut.original ) {
          if ( json[i].stillcut.original.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.original.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.original, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.original 업로드2');
            // console.log(file_name);

            json[i].stillcut.original = file_name;               
            sleep(50);  
          }
        }
        
        if ( json[i].stillcut.small ) {
          if ( json[i].stillcut.small.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.small.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.small, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.small 업로드2');
            // console.log(file_name);

            json[i].stillcut.small = file_name;            
            sleep(50);   
          }
        }
        
        if ( json[i].stillcut.xlarge ) {
          if ( json[i].stillcut.xlarge.length != 0  ) {
            file_uuid = uuid();
            const temp = json[i].stillcut.xlarge.split('.');
            const temp2 = temp[temp.length - 1].split('?');
            const tempName = file_uuid+"."+temp2[0];
            // console.log(tempName);

            await fileDownload(json[i].stillcut.xlarge, './files/'+tempName)
            .then( ()=> console.log('downloaded file no issues...'))
            .catch( e => console.error('error while downloading', e));  

            let file_name = await fileUpload('./files/'+tempName,file_uuid);

            try {
              fs.unlinkSync('./files/'+tempName)
              // console.log('./files/'+tempName+' remove');
              //file removed
            } catch(err) {
              console.error(err)
            }

            // console.log('json[i].stillcut.xlarge 업로드2');
            // console.log(file_name);

            json[i].stillcut.xlarge = file_name;              
            sleep(50);    
          }
        }        
      }

      json[i].register_date = new Date();
      if ( json[i].genres ) {
        if ( Array.isArray(json[i].genres[0]) ) {
          json[i].genres = json[i].genres[0];          
        }
      }
            
      try {
        let contentsRef = contents.doc();

        const res = await contentsRef.set(json[i], { merge: true });
        console.log('Added document with ID: ', res.id);
        console.log('===========================No.'+i+' : '+json[i].title+' : '+res.id+'===========================');
        complate++;
      } catch ( e ) {
        console.error(e);
      }

    }
  }    

  console.log('전체 : '+json.length);
  console.log('성공 : '+complate);

}

handleAsync();
// 완료
