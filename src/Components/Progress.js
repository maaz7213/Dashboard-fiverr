
import React from 'react';
import styled from 'styled-components';

const CircularProgress = ({ size, strokeWidth, percentages, colors }) => {
  const radius = (size - strokeWidth) / 2;

  const getStrokeDashoffset = (percentage, currentCircumference) => {
    return currentCircumference - (percentage / 100) * currentCircumference;
  };

  const averagePercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length; // Calculate average

  return (
    <SvgWrapper width={size} height={size}>
      {percentages.map((percentage, index) => {
        const currentRadius = radius - index * (strokeWidth + 5); // Adjust the radius for inner circles
        const currentCircumference = 2 * Math.PI * currentRadius;

        if (percentage === 0) {
          return null; // Skip rendering for zero percentages to avoid awkward visuals
        }

        return (
          <circle
            key={index} // Ensure each circle has a unique key
            stroke={colors[index]} // Circle color
            fill="transparent"
            strokeWidth={strokeWidth}
            r={currentRadius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={currentCircumference}
            strokeDashoffset={getStrokeDashoffset(percentage, currentCircumference)}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`} // Ensure all circles start at 12 o'clock
          />
        );
      })}
      <text
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fontSize="24" 
        fill="black"
      >
        {Math.round(averagePercentage)} {/* Display the average percentage */}
      </text>
    </SvgWrapper>
  );
};

const SvgWrapper = styled.svg`
  display: block;
  margin: 10px;
`;

export default CircularProgress;
