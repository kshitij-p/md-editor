import React, { useState } from 'react';
import styled from 'styled-components'
import BasicDialog from '../../BasicDialog'
import PrefsColorMenu from './Preferences/PrefsColorMenu';
import PrefsMiscMenu from './Preferences/PrefsMiscMenu';

type PrefsDialogProps = {
    show: boolean;
    onHide: Function & any;
}

const PrefsDialogWrapper = styled.div`
    height: 100%;
    width: 100%;

    display: flex;

    background-color: transparent;

    .switch-view {
        display: flex;
        flex-direction: column;

        width: 80%;
        height: 100%;

        color: white;

        strong {
            align-self: center;
            margin-bottom: 1em;

            font-size: 2em;
            font-weight: 500;
            letter-spacing: 0.2em;
        }

       
    }
`

const Switcher = styled.div`
    width: 20%;
    height: 100%;

    background-color: hsla(0, 0%, 0%, 0.2);
    border-radius: 5px;
    color: white;

    display: flex;
    flex-direction: column;
 

    ul {
        display: flex;
        flex-direction: column;
        justify-content: center;

        padding: 0.5em 0.5em;
        gap: 1em;

        font-weight: 300;
        font-size: 1.25em;
        letter-spacing: 0.2em;

        li {

            padding: 0.5em 0;
            color: hsl(0, 0%, 75%);

            cursor: pointer;
            :hover {
                color: hsl(225, 63%, 74%);
                font-weight: 500;
            }
        }
    }
`

const availableTabs = [
    'Colors',
    'Misc',
]

const PrefsDialog: React.FC<PrefsDialogProps> = (props) => {

    const [activeTab, setActiveTab] = useState(0);

    const renderTabView = () => {
        if (activeTab === 0) {
            return <PrefsColorMenu />
        } else if (activeTab === 1) {
            return <PrefsMiscMenu />
        }
    }


    return (
        <BasicDialog show={props.show} onHide={props.onHide} custom={'background-color: hsla(195, 20%, 10%, 0.75); backdrop-filter: blur(5px); overflow: hidden;'}>
            <PrefsDialogWrapper>
                <Switcher>
                    <ul>
                        {availableTabs.map((x, index) => {
                            let isActive = index === activeTab;
                            return <li style={{ fontWeight: `${isActive ? '500' : ''}`, color: `${isActive ? 'hsl(225, 63%, 74%)' : 'hsl(225, 23%, 74%)'}` }}
                                onClick={() => { setActiveTab(index) }} key={index}>{x}</li>
                        })}
                    </ul>
                </Switcher>

                <div className='switch-view'>
                    <strong className='Title'>{availableTabs[activeTab]}</strong>
                    <div style={{ padding: '2em 0', paddingLeft: '2em' }}>

                        {renderTabView()}
                    </div>
                </div>

            </PrefsDialogWrapper>
        </BasicDialog>
    );
};

export default PrefsDialog;
