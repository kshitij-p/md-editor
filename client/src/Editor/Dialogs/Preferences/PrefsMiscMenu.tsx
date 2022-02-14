import React, { useContext } from 'react'
import styled from 'styled-components'
import { EditorContext } from '../../EditorContext'

const PrefsMiscMenuDiv = styled.div`
    
`

const MiscOption = styled.div`

    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 1.5em;

    .misc-checkbox {
        height: 3em;
        width: 3em;

    }
`

const PrefsMiscMenu = () => {

    const { editorFunctions, editorState } = useContext(EditorContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (editorState.editor.prefsSaveTimeoutRef.current) {

            clearTimeout(editorState.editor.prefsSaveTimeoutRef.current);
        }

        editorFunctions.setSyncScrollingOn(e.currentTarget.checked);

        let newPrefs = { newSyncScrolling: e.currentTarget.checked };

        let timeoutID = setTimeout(() => {

            editorFunctions.savePreferences(newPrefs);

        }, 500)
        editorFunctions.setPrefsSaveTimeout(timeoutID);
    }

    return (
        <PrefsMiscMenuDiv>

            <MiscOption>
                <b>Sync Scrolling</b>
                <input type="checkbox" checked={editorState.editor.preferences.misc.syncScrollingOn} className="misc-checkbox" onChange={handleChange} />
            </MiscOption>

        </PrefsMiscMenuDiv>
    )
}

export default PrefsMiscMenu