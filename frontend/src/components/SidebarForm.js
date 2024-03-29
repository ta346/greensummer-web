// SidebarForm.js
import React, { useState } from 'react';
import Dropdown from './Dropdown';
import '../styles/Sidebar.css'; // Import App.css for global styles
// import Sidebar from './Sidebar';

const PastureOnlyCheckbox = ({ onChange }) => {
  return (
    <div className="checkbox-container">
      <label>
        <input
          type="checkbox"
          className="checkbox-input"
          onChange={onChange}
        />
        Grazing Only
      </label>
    </div>
  );
};

const SidebarForm = ({provinceData, onApplyLayer}) => {
  const provinces = Object.keys(provinceData);
  const [expanded, setExpanded] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
  const [selectedSoum, setSelectedSoum] = useState(provinceData[provinces[0]]);
  const vegetationIndices = ["NDVI", "EVI", "SAVI", /* ... */];
  const years = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

  // State variables to track selected indicator and year
  const [selectedIndicator, setSelectedIndicator] = useState(vegetationIndices[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  // State variable to track checkbox state
  const [grazingOnly, setGrazingOnly] = useState(false);

  // State variables to track active buttons
  const [layerMapActive, setLayerMapActive] = useState(false);
  const [viewGraphActive, setViewGraphActive] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const handleProvinceChange = (selectedProvince) => {
    setSelectedProvince(selectedProvince);
    setSelectedSoum(provinceData[selectedProvince]);
  };

  const handleSoumChange = (selectedSoum) => {
    // Handle the selected soum here or pass the value to any parent component
    console.log(selectedSoum);
  };

  // Event handler for the "Select Indicators" dropdown
  const handleIndicatorChange = (selectedIndicator) => {
    setSelectedIndicator(selectedIndicator);
  };

  // Event handler for the "Select Year" dropdown
  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  // Event handler for the checkbox
  const handleCheckboxChange = (event) => {
    setGrazingOnly(event.target.checked);
  };

  // Event handler for the "Apply Layer" button
  const handleLayerMap = () => {
    setLayerMapActive(true);
    setViewGraphActive(false);

    // Prepare the data to be sent to the API
    const data = {
      selectedProvince,
      selectedSoum: selectedSoum[0], // Only send the first selected soum
      selectedVegetationIndex: selectedIndicator,
      selectedYear,
      grazingOnly,
    };

     // Call the callback to fetch and update geoJSONData
     onApplyLayer(data);
  };

  const handleViewGraph = () => {
    setLayerMapActive(false);
    setViewGraphActive(true);
    // Add logic for view graph functionality here
  };

  return (
    <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
      <button onClick={handleToggleExpand}>
        {expanded ? 'Hide Sidebar' : 'Expand Sidebar'}
      </button>
      {expanded && (
        <>
          <div className="region-select">
            <h4>Select Region</h4>
            <Dropdown options={provinces} onSelect={handleProvinceChange} />
          </div>

          <div className="region-select">
            <h4>Select Soum</h4>
            <Dropdown options={selectedSoum} onSelect={handleSoumChange} />
          </div>

          <div className="region-select">
            <h4>Select Indicators</h4>
            <Dropdown options={vegetationIndices} onSelect={handleIndicatorChange} />
          </div>

          <div className="region-select">
            <h4>Select Year</h4>
            <Dropdown options={years} onSelect={handleYearChange} />
          </div>

          <div className="region-select">
            <h4>Select Grazing</h4>
            <PastureOnlyCheckbox onChange={handleCheckboxChange} />
          </div>

          {/* Buttons for Layer Map and View Graph */}
          <div className="button-container">
            <button
              onClick={handleLayerMap}
              className={`button ${layerMapActive ? 'active' : ''}`}
            >
              Apply Layer
            </button>
            <button
              onClick={handleViewGraph}
              className={`button ${viewGraphActive ? 'active' : ''}`}
            >
              View Graph
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarForm;

// import React, { useState } from 'react';
// import Dropdown from './Dropdown';
// import '../styles/Sidebar.css';

// const PastureOnlyCheckbox = ({ onChange }) => {
//   return (
//     <div className="checkbox-container">
//       <label>
//         <input type="checkbox" className="checkbox-input" onChange={onChange} />
//         Grazing Only
//       </label>
//     </div>
//   );
// };

// const SidebarForm = ({ provinceData, onApplyLayer }) => {
//   const provinces = Object.keys(provinceData);

//   const [expanded, setExpanded] = useState(true);
//   const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
//   const [selectedSoum, setSelectedSoum] = useState(provinceData[provinces[0]]);
//   const vegetationIndices = ["NDVI", "EVI", "SAVI", /* ... */];
//   const years = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];
  
//   const [selectedIndicator, setSelectedIndicator] = useState(vegetationIndices[0]);
//   const [selectedYear, setSelectedYear] = useState(years[0]);
//   const [grazingOnly, setGrazingOnly] = useState(false);
//   const [layerMapActive, setLayerMapActive] = useState(false);
//   // const [viewGraphActive, setViewGraphActive] = useState(false);

//   const handleToggleExpand = () => {
//     setExpanded((prevExpanded) => !prevExpanded);
//   };


//   const handleLayerMap = () => {
//     setLayerMapActive(true);
//     // setViewGraphActive(false);
//     const data = {
//       selectedProvince,
//       selectedSoum: selectedSoum[0],
//       selectedVegetationIndex: selectedIndicator,
//       selectedYear,
//       grazingOnly,
//     };
//     onApplyLayer(data);
//   };

//   return (
//     <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
//       <button onClick={handleToggleExpand}>
//         {expanded ? 'Hide Sidebar' : 'Expand Sidebar'}
//       </button>
//       {expanded && (
//         <>
//           <div className="region-select">
//             <h4>Select Region</h4>
//             <Dropdown
//               options={provinces}
//               onSelect={setSelectedProvince}
//             />
//           </div>

//           <div className="region-select">
//             <h4>Select Soum</h4>
//             <Dropdown
//               options={selectedSoum}
//               onSelect={setSelectedSoum}
//             />
//           </div>

//           <div className="region-select">
//             <h4>Select Indicators</h4>
//             <Dropdown
//               options={vegetationIndices}
//               onSelect={setSelectedIndicator}
//             />
//           </div>

//           <div className="region-select">
//             <h4>Select Year</h4>
//             <Dropdown
//               options={years}
//               onSelect={setSelectedYear}
//             />
//           </div>

//           <div className="region-select">
//             <h4>Select Grazing</h4>
//             <PastureOnlyCheckbox onChange={setGrazingOnly} />
//           </div>

//           <div className="button-container">
//             <button
//               onClick={handleLayerMap}
//               className={`button ${layerMapActive ? 'active' : ''}`}
//             >
//               Apply Layer
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SidebarForm;
