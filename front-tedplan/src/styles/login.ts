import styled from 'styled-components';

export const Container = styled.div`
    color: #666;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(66, 137, 91, 0.05) 0%, transparent 70%);
        animation: pulse 20s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1) rotate(0deg);
        }
        50% {
            transform: scale(1.1) rotate(5deg);
        }
    }
`;

export const DivLogin = styled.div`
    color: #666;
    font-family: inherit;
    max-width: 420px;
    width: 100%;
    border-radius: 20px;
    background: #fff;
    padding: 50px 40px;
    margin: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 
                0 0 1px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 1;
    animation: slideUp 0.6s ease-out;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.12), 
                    0 0 1px rgba(0, 0, 0, 0.05);
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    h1 {
        font-size: 28px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        color: #333;
    }
    
    img {
        width: 250px;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.02);
    }

    small {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export const Brasao = styled.div`
    width: 100%;
    margin: 0 auto 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;
`;

export const Form = styled.form`
    margin-top: 30px;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    input {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 16px 20px;
        margin: 0;
        font-size: 18px;
        font-family: inherit;
        color: #333;
        background: #fff;
        transition: all 0.3s ease;
        outline: none;
        width: 100%;
        box-sizing: border-box;

        &::placeholder {
            color: #999;
        }

        &:focus {
            border-color: #42895b;
            box-shadow: 0 0 0 3px rgba(66, 137, 91, 0.1);
            transform: translateY(-1px);
        }

        &:hover {
            border-color: #ccc;
        }
    }
`;

export const ForgotPasswordLink = styled.a`
    color: #42895b;
    font-size: 14px;
    text-decoration: none;
    text-align: right;
    margin-top: -10px;
    margin-bottom: 5px;
    transition: all 0.3s ease;
    font-weight: 500;
    cursor: pointer;
    align-self: flex-end;

    &:hover {
        color: #134a55;
        text-decoration: underline;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const SubmitButton = styled.button`
    padding: 16px 24px;
    margin: 10px 0 0 0;
    color: #fff;
    border: none;
    background: linear-gradient(135deg, #42895b 0%, #3a7a52 100%);
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(66, 137, 91, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }

    &:hover {
        background: linear-gradient(135deg, #134a55 0%, #0f3a42 100%);
        box-shadow: 0 6px 20px rgba(19, 74, 85, 0.4);
        transform: translateY(-2px);
    }

    &:hover::before {
        width: 300px;
        height: 300px;
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(66, 137, 91, 0.3);
    }

    svg {
        margin-right: 8px;
    }
`;

export const Footer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    background: linear-gradient(135deg, #444 0%, #333 100%);
    text-align: center;
    padding: 12px;
    font-size: 12px;
    z-index: 100;
    backdrop-filter: blur(10px);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;
