import { ProgressSpinner } from 'primereact/progressspinner';
import styled from 'styled-components';

const SpinnerContainer = styled.label`
    display: flex;
    height: 60vh;
    justify-content: center;
    align-items: center`

function Loading () {
    return (
        <SpinnerContainer>
            <ProgressSpinner/>
        </SpinnerContainer>
    )
}

export default Loading;