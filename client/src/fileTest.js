import React, { useRef } from 'react';

const path = require('path-browserify');

const FileTest = () => {

    const fileRef = useRef(null);

    const fileReady = async (e) => {
        
        let formData = new FormData();

        if(fileRef.current.files.length){

            formData.append('file', fileRef.current.files[0]);
        } else {
            formData.append('path', path.join('public', 'README.md'));
        }

        console.log(path.join('public', 'README.md'))

        let headers = new Headers();
        headers.append('uploading-file', fileRef.current.files.length > 0);

        let request = await fetch('/api/parsefile', { method: "POST", body: formData, headers: headers});
        let response = await request.json();
        console.log({ response });

    }

    return <div>
        <input type="file" multiple={false} accept=".md, .txt" ref={fileRef} />

        <button onClick={fileReady}>Send</button>
    </div>;
};

export default FileTest;
