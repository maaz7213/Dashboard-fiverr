// import React from 'react';
// import styled from 'styled-components';


// const CircularProgress = ({ size, strokeWidth, percentages, colors }) => {

// console.log("percentages ",percentages);

//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const getStrokeDashoffset = (percentage) => {
//     return circumference - (percentage / 100) * circumference;
//   };

//   const averagePercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length; // Calculate average

//   return (
//     <SvgWrapper width={size} height={size}>
//       {percentages.map((percentage, index) => {
//         const currentRadius = radius - index * (strokeWidth + 5); // Reduces radius for inner circles
//         const currentCircumference = 2 * Math.PI * currentRadius;
//         return (
//           <svg width={size} height={size}>
//           <circle
//             key={index}
//             stroke={colors[index]} // Circle color based on index
//             fill="transparent"
//             strokeWidth={strokeWidth}
//             r={currentRadius}
//             cx={size / 2}
//             cy={size / 2}
//             strokeDasharray={currentCircumference}
//             strokeDashoffset={getStrokeDashoffset(percentage)}
//             strokeLinecap="round"
//           />
//           <text
//             x="50%" 
//             y="50%" 
//             dominantBaseline="middle" 
//             textAnchor="middle" 
//             fontSize="24" 
//             fill="black"
//           >
//             {Math.round(averagePercentage)} {/* Display the value, rounded */}
//           </text>
//         </svg>
//         );
//       })}
//     </SvgWrapper>
//   );
// };
// const SvgWrapper = styled.svg`
//   display: block;
//   margin: 10px;
// `;

// export default CircularProgress;

import React from 'react';
import styled from 'styled-components';

const CircularProgress = ({ size, strokeWidth, percentages, colors }) => {

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getStrokeDashoffset = (percentage, previousPercentage) => {
    const offset = circumference - (percentage / 100) * circumference;
    const previousOffset = (previousPercentage / 100) * circumference;
    return offset + previousOffset;
  };

  const totalPercentage = percentages.reduce((a, b) => a + b, 0); // Total percentage for tracking

  return (
    <SvgWrapper width={size} height={size}>
      {percentages.reduce((acc, percentage, index) => {
        const currentRadius = radius - index * (strokeWidth + 5); // Adjusts the radius for inner circles
        const currentCircumference = 2 * Math.PI * currentRadius;
        const strokeDashoffset = getStrokeDashoffset(percentage, acc.previousPercentage);
        acc.previousPercentage += percentage; // Accumulates percentage to track where the next one starts
        return (
          <svg key={index} width={size} height={size}>
            <circle
              stroke={colors[index]} // Circle color based on index
              fill="transparent"
              strokeWidth={strokeWidth}
              r={currentRadius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={currentCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate to start from top
            />
          </svg>
        );
      }, { previousPercentage: 0 })}
      <text
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fontSize="24" 
        fill="black"
      >
        {Math.round(totalPercentage / percentages.length)}% {/* Display average percentage */}
      </text>
    </SvgWrapper>
  );
};

const SvgWrapper = styled.svg`
  display: block;
  margin: 10px;
`;

export default CircularProgress;
