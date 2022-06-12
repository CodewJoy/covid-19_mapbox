import React from "react";
import styled from 'styled-components';

const LegendPanel = styled.div`
  position: absolute;
  bottom: 0;
  right: 0px;
  margin: 30px;
  padding: 10px;
  background-color: rgb(255, 255, 255, 0.8);
  border-radius: 5px;
  .legendItem {
    display:flex;
    align-items: center;
  }
`;

const LegendColor = styled.div`
  width: 30px;
  height: 30px;
  margin: 5px;
  background-color: ${({ color }) => color};
  border: black 1px solid;
`;

function Legend(props) {
    return (
        <LegendPanel>
            {
                props.legendList.reverse().map((el, index) => (
                    <div className="legendItem" key={index}>
                        <LegendColor color={el.color} />
                        <div className="legendText">
                            {el.text}
                        </div>
                    </div>
                ))
            }
        </LegendPanel>
    );
}

export default Legend;

