const fs = require('fs');
const path = require('path');

const getUserFiles = async (userid) => {

    /* Check for user files directory */
    await new Promise((resolve, reject)=>{

        fs.readdir(path.join(__dirname, '..', 'public', 'userfiles'), async(e, files) => {
            if (e) {
                await fs.promises.mkdir(path.join(__dirname, '..', 'public', 'userfiles'));
                resolve(null);
            }
            resolve(null)
        });
    })



    let targetPath = path.join(__dirname, '..', 'public', 'userfiles', userid);

    let files = await new Promise((resolve, reject) => {

        fs.readdir(targetPath, async (e, files) => {
            if (e) {
                await fs.promises.mkdir(targetPath);

                resolve(await fs.promises.readdir(targetPath));

            }
            resolve(files);

        })
    })
    console.log({ files });
    return files
}


module.exports = getUserFiles;