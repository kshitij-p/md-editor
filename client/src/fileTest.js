import React from 'react';

const FileTest = () => {

    const fileReady = async (e) => {

        if (!e.target.files.length) {
            return
        }

        
        let formData = new FormData();


        formData.append('file', e.target.files[0]);


        let request = await fetch('/api/parsefile', { method: "POST", body: formData, });
        let response = await request.json();
        console.log({ response });

    }

    return <div>
        <input type="file" onChange={fileReady} multiple={false} accept=".md, .txt" />
    </div>;
};

export default FileTest;
