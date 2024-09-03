import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState } from "react";

function Dashboard_Filter({
    filterOptions = {
        keyword: "",
        dateRange: "",
        price: [10, 3000],
    },
    setFilterOptions,
    handleFilterClear,
}) {
    // function to handle filter values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "keyword":
                setFilterOptions({ ...filterOptions, keyword: value });
                break;
            case "dateRange":
                setFilterOptions({ ...filterOptions, dateRange: value });
                break;
            default:
                break;
        }
    };

    // function to handle price change in filters
    const handlePriceChange = (value) => {
        setFilterOptions({ ...filterOptions, price: [...value] });
    };

    return (
        // Add filter options to the DOM element
        <div>
            <h2 className="mb-2 text-lg font-medium">Filter Options</h2>
            <form className="flex flex-col gap-y-3">
                {/* Input to search through keyword */}
                <div className="mb-2">
                    <label htmlFor="keyword" className="block mb-1 font-medium">
                        Keyword
                    </label>
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        value={filterOptions.keyword}
                        onChange={handleInputChange}
                        className="filterInput"
                        placeholder="Search by keyword..."
                    />
                </div>
            
                {/* Input field to filter through a date range */}
                <div className="mb-2">
                    <label
                        htmlFor="dateRange"
                        className="block mb-1 font-medium"
                    >
                        Events After Date
                    </label>
                    <input
                        type="date"
                        id="dateRange"
                        name="dateRange"
                        value={filterOptions.dateRange}
                        onChange={handleInputChange}
                        className="filterInput"
                    />
                </div>
                <div>
                    <h3>Price</h3>
                    <Slider
                        range
                        min={0}
                        max={3000}
                        step={10}
                        defaultValue={[10, 100]}
                        value={filterOptions.price}
                        onChange={handlePriceChange}
                    />
                    <p>
                    £{filterOptions.price[0]} - £{filterOptions.price[1]}
                    </p>
                </div>
            </form>
            <button
                onClick={handleFilterClear}
                className="w-full px-4 py-2 mt-2 text-white bg-gray-700 rounded-lg hover:bg-gray-800"
            >
                Clear Filters
            </button>
        </div>
    );
}

export default Dashboard_Filter;
