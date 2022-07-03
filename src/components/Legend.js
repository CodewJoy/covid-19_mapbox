import React from 'react';
import styled from 'styled-components';
import { capitalize } from 'lodash-es';

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
      margin: 0 0 10px 0;
      text-align: center;
  }
  .legendSubTitle {
    font-size: 15px;
    margin: 0 0 15px 0;
    text-align: center;
  }
`;
const LegendItem = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ width }) => `${width * 5}px`};
`;
const LegendColorWrapper = styled.div`
  width: ${({ width }) => `${width * 5}px`};
  display:flex;
  justify-content: center;
`;
const LegendColor = styled.div`
  width: ${({ width }) => `${width * 5}px`};
  height: ${({ width }) => `${width * 5}px`};
  background-color: ${({ color }) => color};
  border: black 1px solid;
  border-radius: 50%;
`;

function Legend(props) {
    return (
        <LegendPanel>
             <div className="legendTitle">
                {capitalize(props.title)}
             </div>
             <div className="legendSubTitle">World Total Amount</div>
            {
                props.legendList && props.legendList.map((el, index) => (
                    <LegendItem key={index} width={props.legendList.length + 1}>
                          <LegendColorWrapper width={props.legendList.length + 1}>
                            <LegendColor color={el.color} width={index + 1}/>
                          </LegendColorWrapper> 
                        <div className="legendText">
                            {el.text}
                        </div>
                    </LegendItem>
                ))
            }
        </LegendPanel>
    );
}

export default Legend;

