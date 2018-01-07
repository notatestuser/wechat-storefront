import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  flex-basis: ${({ basis }) => basis};
  flex-direction: ${({ direction }) => direction};
  flex-grow: ${({ grow }) => grow};
  flex-wrap: ${({ wrap }) => wrap || 'wrap'};
  justify-content: ${({ justify }) => justify};
  padding: ${({ padding }) => padding};
`;
