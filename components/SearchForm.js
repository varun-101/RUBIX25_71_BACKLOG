import React from "react";
import SearchFormReset from "./SearchFormReset";
import SearchTabs from "./SearchTabs";
import { Search } from "lucide-react";
import Form from "next/form";
import { searchAction } from "@/app/actions";

const SearchForm = async ({ searchParams, activeTab }) => {
    const query = (await searchParams)?.query || '';
    console.log(query);
    

    const placeholders = {
        rent: "Search Rental Properties",
        buy: "Search Properties for Sale",
        plots: "Search Plots and Land"
    };

    return (
        <div className="w-full max-w-3xl">
            <Form action="/" scroll={false} className="search-form">
                <input 
                    name="query"
                    defaultValue={query}
                    className="search-input"
                    placeholder={placeholders[activeTab]}
                />
                <input 
                    type="hidden" 
                    name="type" 
                    value={activeTab}
                />
                <div className="flex gap-2">
                    {query && <SearchFormReset />}
                    <button type="submit" className="search-btn text-white">
                        <Search className="size-5"/>
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default SearchForm;