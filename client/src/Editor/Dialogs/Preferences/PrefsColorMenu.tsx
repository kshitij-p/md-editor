import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color'
import { EditorContext } from '../../EditorContext';
import { AuthContext } from '../../../Auth/AuthContext';

const PrefsColorMenuDiv = styled.div<{ selectingColor: boolean }>`
    align-self: center;
    width: 100%;
    height: 100%;

    
    overflow-y: scroll;
    position: relative;

    ::-webkit-scrollbar {
        display: none;
    }

    .color-option {
        min-height: auto;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        
        font-size: 1.5em;
        letter-spacing: 0.3em;
        line-height: 125%;

        margin-bottom: 1em;
        position: relative;

        b {
            width: 70%;
        }

        div.colorbox {
            width: 2.5em;
            height: 2.5em;

            margin-right: 10%;
            background-color: white;
           

            display: inline-block;
            padding: 0.5%;

            border-radius: 5px;
            
            .colorbox-color {
                height: 100%;
                width: 100%;
                background-color: red;
            }

            .ColorPicker {
                position: absolute;
                top: 0;
                left: 50%;
                
                margin-left: 0%;

                opacity: 1;
                visibility: visible;

                transition: 0.15s ease-in-out;
                z-index: 999;
            }

            .hidden {
                opacity: 0;
                visibility: hidden;
            }

            .spaced {
                margin-top: -5%;
            }
            
        }
        
    }

    
`

type ColorBoxProps = {
    boxIndex: number;
    title: string;
    color: ColorResult;
}

const ColorBox: React.FC<ColorBoxProps> = (props) => {

    const { editorState, editorFunctions } = useContext(EditorContext);

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const colorBoxRef = useRef<HTMLDivElement>(null);

    const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setColorPickerOpen(true);
    }

    const handleOnColorChange: ColorChangeHandler = (newColor, e) => {

        if (editorState.editor.prefsSaveTimeoutRef.current) {

            clearTimeout(editorState.editor.prefsSaveTimeoutRef.current);
        }

        let newColors = editorState.editor.customTheme.colors.map((x, index) => {
            if (index === props.boxIndex) {
                return { ...x, color: newColor.hex };
            } else return x;
        })

        let newTheme = { name: "Custom", colors: newColors };

        editorFunctions.setCustomTheme(newTheme);


        let newPrefs = { newCustomTheme: newTheme };
        let timeoutID = setTimeout(() => {
            editorFunctions.savePreferences(newPrefs);
        }, 1000)
        editorFunctions.setPrefsSaveTimeout(timeoutID);

    }

    /* Close sketch picker on outside click */
    useEffect(() => {

        const closeOnOutsideClick = (e: any) => {
            let colorPicker = document.querySelector('.sketch-picker');
            if (!colorBoxRef.current?.contains(e.target) && !colorPicker?.contains(e.target)) {
                setColorPickerOpen(false);
            }
        }

        if (colorPickerOpen) {
            document.addEventListener('click', closeOnOutsideClick);
        }

        return function cleanup() {
            document.removeEventListener('click', closeOnOutsideClick);
        }

    }, [colorPickerOpen])

    return (
        <div className='color-option'>
            <b>{props.title}</b>
            <div className='colorbox' onClick={handleOnClick} ref={colorBoxRef}>
                <div className='colorbox-color' style={{ backgroundColor: props.color.hex }}></div>
                <SketchPicker className={`ColorPicker ${colorPickerOpen ? '' : 'hidden'} ${props.boxIndex <= 0 ? '' : 'spaced'} `} onChange={handleOnColorChange} color={props.color.hex} />
            </div>


        </div>
    )
}


const PrefsColorMenu = () => {

    const { editorState, editorFunctions } = useContext(EditorContext);
    const { preferences } = editorState.editor;

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        if (editorState.editor.prefsSaveTimeoutRef.current) {

            clearTimeout(editorState.editor.prefsSaveTimeoutRef.current);
        }

        editorFunctions.setSelectedTheme(parseInt(e.target.value));

        let newPrefs = { newSelectedTheme: e.target.value };


        let timeoutID = setTimeout(() => {
            editorFunctions.savePreferences(newPrefs);
        }, 1000)

        editorFunctions.setPrefsSaveTimeout(timeoutID);
    }

    return (
        <PrefsColorMenuDiv selectingColor={false} >

            <div className='theme-selector-container'>
                <select value={preferences.selectedTheme} onChange={handleDropdownChange}>
                    {preferences.themes.map((x, index) => <option key={index} value={index}>{x.name}</option>)}
                </select>
            </div>

            {preferences.selectedTheme === preferences.themes.length - 1 ?

                <>

                    <div className='options-list'>

                        {editorState.editor.customTheme.colors.map((color, index) => {
                            return <ColorBox title={color.name} color={{ hex: color.color } as ColorResult} boxIndex={index} key={index} />
                        })}


                    </div>
                </>
                :
                <>
                </>
            }


        </PrefsColorMenuDiv>
    );
};

export default PrefsColorMenu;
