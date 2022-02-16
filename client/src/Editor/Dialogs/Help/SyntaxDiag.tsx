import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import BasicDialog from '../../../BasicDialog'
import { responsiveSizes } from '../../../utils/responsiveSizes'

type SyntaxDiagProps = {
    show: boolean;
    onHide: Function & (() => void);
}

const SyntaxHelpDiv = styled.div`

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: white;

    h2.title-text {
        font-size: 4em;
        margin-bottom: 60px;
    }

    

`

const SyntaxTableContainer = styled.div`

    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    width: 95%;

    padding: 1em;

    background-color: hsla(0, 0%, 50%, 0.13);

    font-size: 24px;

    .grid-container {

        display: grid;
        

        @media (min-width: ${responsiveSizes.tablet}){
            grid-template-columns: repeat(2, 1fr);
        }

        > * {

            padding: 1.5em 0;

            @media (min-width: ${responsiveSizes.tablet}){
                border-bottom: 1px solid hsl(0, 0%, 50%);
            }
            
        }
    }

    .syntax-block {

        display: flex;
        flex-direction: column;
        justify-content: center;

        gap: 1em;


        @media (max-width: ${responsiveSizes.phone}){
            border-bottom: 1px solid hsl(0, 0%, 50%);
        }

        b {
            font-size: 1em;
        }

        .indented {
            margin-left: 1em;
        }

        span.tooltip {
            padding: 0.25em;

            background-color: hsl(0, 0%, 30%);
            border-radius: 5px;

            color: hsl(0, 0%, 70%);
        }

    }
    
    

`

const SyntaxRenderedBlock = styled.div`
  
    display: flex;
    flex-direction: column;
    justify-content: center;

    font-weight: 200;

    @media (max-width: ${responsiveSizes.phone}){
        border-bottom: 3px solid white;
    }

    > * {

        @media (min-width: ${responsiveSizes.tablet}){

            margin-left: 15%;
        }
    }

    h1 {
        font-weight: 700;
        font-size: 2.6em;    
    }

    strong {
        font-weight: 500;
    }

    .italic {
        font-style: italic;
    }

    
    span.rendered-link-wrapper {

        position: relative;
        white-space: pre;
        width: max-content;

        a.rendered-link {
            
            position: relative;

            color: hsl(207, 90%, 64%);
            text-decoration: none;

            :hover + span.rendered-link-tooltip {
                opacity: 1;
                visibility: visible;
            }

            :hover {
                text-decoration: underline;
            }
            
        }

        span.rendered-link-tooltip {
            position: absolute;
            height: 100%;
            padding: 0.75em 0.5em;

            top: 75%;
            left: 50%;

            display: flex;
            align-items: center;

            
            background-color: hsl(0, 0%, 30%);
            border-radius: 5px;
            color: white;
            
            opacity: 0;
            visibility: hidden;

            transition: 0.1s ease-in-out;
            transition-delay: 1s;
            
            b {
                text-overflow: ellipsis;
                min-width: 0;
                overflow: hidden;
                width: 12rem;
            }

            :hover {
                opacity: 1;
                visibility: visible;

                
            }
        }

    }

    blockquote {

        padding: 0.5em 0.5em;
        padding-right: 0;

            blockquote {

                margin: 0.5em 0;
            }

        background-color: hsl(0, 0%, 30%);
        border-left: 0.25em solid white;

        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
            margin: 0;
        }
    
    }

    ol, ul {
        margin-left: 16%;
    }

    ol {
        display: flex;
        flex-direction: column;
        list-style: auto;
    }

    ul {

        display: flex;
        flex-direction: column;

        list-style: disc;
    }

    li {
        ul {
            list-style: circle;
        }
    }
    
    code {
        background-color: hsl( 0,0%, 30%);
        border-radius: 10px;
        height: max-content;
        padding: 0 0.25em;
        line-height: 170%;
    }

`

const SyntaxDiag: React.FC<SyntaxDiagProps> = (props) => {
    return (
        <BasicDialog show={props.show} onHide={props.onHide}
            custom={'background-color: hsla(195, 20%, 10%, 0.75); backdrop-filter: blur(5px); overflow: hidden;'} >
            <SyntaxHelpDiv>

                <h2 className='title-text'>Markdown Syntax</h2>
            {/*     <Link to={''}/> */}

                <SyntaxTableContainer>

                    <div className='grid-container'>

                        <div className='syntax-block'>
                            <p># heading</p>

                            <span className='tooltip'>No. of # = heading size (upto 6 #s)</span>
                        </div>
                        <SyntaxRenderedBlock>
                            <h1>heading</h1>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>
                            <p>Look mom, **bold text**</p>
                            <p>Look mom, __bold text__</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <p>Look mom, <strong>bold text</strong></p>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>
                            <p>*Sighs* these jokes.....</p>
                            <p>_Sighs_ these jokes.....</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <p><b className='italic'>Sighs</b> these jokes.....</p>
                        </SyntaxRenderedBlock>


                        <div className='syntax-block'>
                            <p>{'>Oblivion npc'}<br />{`>>Stop right there`}</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <blockquote>

                                <p>Oblivion npc<br />
                                    <blockquote>

                                        <p>Stop right there</p>
                                    </blockquote>
                                </p>
                            </blockquote>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>

                            <p>- First item<br />
                                - Second item <br />
                                - Third item <br />
                                <b className='indented'>-Indented item</b> <br />
                                <b className='indented'>- Indented item <br /></b>
                                - Fourth item <br /> </p>

                            <span className='tooltip'>Can use - or * or + for lists</span>

                        </div>
                        <SyntaxRenderedBlock>
                            <ul>
                                <li>First item</li>
                                <li>Second item</li>
                                <li>Third item<ul>
                                    <li>Indented item</li>
                                    <li>Indented item</li>
                                </ul>
                                </li>
                                <li>Fourth item</li>
                            </ul>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>
                            <p>Shopping List <br />1. Vertically challenged human </p>
                            <span className='tooltip'>Can also be nested/indented</span>
                        </div>
                        <SyntaxRenderedBlock>
                            <p>Shopping List</p>
                            <ol>

                                <li>Oblivion npc</li>
                            </ol>
                        </SyntaxRenderedBlock>


                        <div className='syntax-block'>

                            <p>`import React from 'react'`</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <p><code>import React from 'react'</code></p>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>

                            <p style={{ fontSize: '0.75em' }}>[Link text](link address, "optional link tooltip title displayed on hover").</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <span className='rendered-link-wrapper'>
                                <a className='rendered-link' href='https://github.com/kshitij-p'>Author's github</a>
                                <span className='rendered-link-tooltip'><b>Hello there :D </b></span>
                            </span>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>

                            <p>{'<link/email id>'}</p>

                        </div>
                        <SyntaxRenderedBlock>
                            <span className='rendered-link-wrapper'>
                                <a className='rendered-link' href='mailto:me@irl.com'>me@irl.com</a>
                            </span>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>

                            <p style={{ fontSize: '0.75em' }}>[Alt text displayed for text readers](link address, "optional image title").</p>

                            <span className='tooltip'>Alt text is important for text readers and for blind people
                                <br />
                                <br />
                                Image size is original image size</span>
                        </div>
                        <SyntaxRenderedBlock>
                            <span className='rendered-link-wrapper'>
                                <img src='https://cdns-images.dzcdn.net/images/cover/6b4d089ceb88da50d8d541c3157db234/264x264.jpg' title="Crystal Lake Mephisto Album Cover" alt="Crystal Lake Mephisto Album Cover" />
                            </span>
                        </SyntaxRenderedBlock>

                        <div className='syntax-block'>

                            <p>Look a line yay
                                <br />
                                <br />
                                ---
                                <br />
                                <br />
                                ...There is a line above me :o
                            </p>

                            <span className='tooltip'>
                                The extra blank lines are necessary
                                <br />
                                <br />
                                ... for next line is "optional" but recommended</span>
                        </div>
                        <SyntaxRenderedBlock>
                            <p>Look a line yay
                                <hr />
                                There is a line above me :o
                            </p>
                        </SyntaxRenderedBlock>



                    </div>

                </SyntaxTableContainer>


            </SyntaxHelpDiv>
        </BasicDialog>
    )
}

export default SyntaxDiag