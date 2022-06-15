import React from "react";
import styled from 'styled-components';
import capitalize from "lodash/capitalize";

const LegendPanel = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 30px 10px;
  padding: 10px;
  background-color: rgb(255, 255, 255, 0.8);
  border-radius: 5px;
  font-family: 'Arial';
  .legendTitle {
      font-size: 25px;
      font-weight: bold;
  }
  .legendItem {
    display:flex;
    align-items: center;
  }
`;
const LegendColorWrapper = styled.div`
  width: ${({ width }) => `${width * 5}px`};
  display:flex;
  justify-content: center;
  margin: 5px;
`;
const LegendColor = styled.div`
  width: ${({ width }) => `${width * 5}px`};
  height: ${({ width }) => `${width * 5}px` };
  background-color: ${({ color }) => color };
  border: black 1px solid;
  border-radius: 50%;
`;

function Legend(props) {
    console.log('props.legendList', props.legendList);
    return (
        <LegendPanel>
             <div className="legendTitle">
                {capitalize(props.title)}
             </div>
            {
                props.legendList && props.legendList.map((el, index) => (
                    <div className="legendItem" key={index}>
                          <LegendColorWrapper width={props.legendList.length}>
                            <LegendColor color={el.color} width={index + 1}/>
                          </LegendColorWrapper> 
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

