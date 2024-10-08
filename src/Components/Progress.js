import React from 'react';
import styled from 'styled-components';


const CircularProgress = ({ size, strokeWidth, percentages, colors }) => {

console.log("percentages ",percentages);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const getStrokeDashoffset = (percentage) => {
    return circumference - (percentage / 100) * circumference;
  };

  const averagePercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length; // Calculate average

  return (
    <SvgWrapper width={size} height={size}>
      {percentages.map((percentage, index) => {
        const currentRadius = radius - index * (strokeWidth + 5); // Reduces radius for inner circles
        const currentCircumference = 2 * Math.PI * currentRadius;
        return (
          <svg width={size} height={size}>
          <circle
            key={index}
            stroke={colors[index]} // Circle color based on index
            fill="transparent"
            strokeWidth={strokeWidth}
            r={currentRadius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={currentCircumference}
            strokeDashoffset={getStrokeDashoffset(percentage)}
            strokeLinecap="round"
          />
          <text
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fontSize="24" 
            fill="black"
          >
            {Math.round(averagePercentage)} {/* Display the value, rounded */}
          </text>
        </svg>
        );
      })}
    </SvgWrapper>
  );
};
const SvgWrapper = styled.svg`
  display: block;
  margin: 10px;
`;

export default CircularProgress;