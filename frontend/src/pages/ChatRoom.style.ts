import styled from "styled-components";

const breakpoints = {
    tablet : '768px',
    desktop: '1024px',
};

export const ChatRoomStyle = styled.div`
    // 모바일 기준
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    // 태블릿 기준
    @media screen and (min-width: ${breakpoints.tablet}) {
        background-color: red;
    }

    // 데스크탑 기준
    @media screen and (min-width: ${breakpoints.desktop}) {
        background-color: yellow;
    }
`;