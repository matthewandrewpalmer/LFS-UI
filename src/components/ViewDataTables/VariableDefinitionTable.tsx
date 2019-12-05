import React, {ChangeEvent, Component} from "react";
import {ONSAccordionTable} from "../ONS_DesignSystem/ONSAccordionTable";
import {VARIABLE_DEFINITION_HEADERS} from "../../utilities/Headers";
import {ONSCheckbox} from "../ONS_DesignSystem/ONSCheckbox";
import DocumentTitle from "react-document-title";
import dateFormatter from "dayjs";
import {getVariableDefinitions} from "../../utilities/http";
import {ONSTextInput} from "../ONS_DesignSystem/ONSTextInput";
import {ONSButton} from "../ONS_DesignSystem/ONSButton";
import {isDevEnv} from "../../utilities/Common_Functions";

interface Props {
}

interface State {
    data: []
    filteredData: []
    search: string
    noDataMessage: string
}

interface VariableDefinitionTableRow {
    variable: string
    description: {String: string, Valid: boolean}
    label: {String: string, Valid: boolean}
    type: string
    validFrom: Date
    length: number
    precision: number
    alias: {String: string, Valid: boolean}
    editable: boolean
    expanded: boolean
    imputation: boolean
    dv: boolean
}

export class VariableDefinitionTable extends Component <Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            filteredData: [],
            search: "",
            noDataMessage: this.noDataMessage
        };
        this.getVariableDefinitionData();
    }

    getVariableDefinitionData = () => {
        getVariableDefinitions()
            .then(r => {
                (isDevEnv() && console.log(r));
                if (r.message !== "no data found") {
                    this.setState({data: r, filteredData: r});
                } else this.setState({filteredData: [], noDataMessage: "No Variable Definitions found"});
            })
            .catch(error => {
                (isDevEnv() && console.log(error));
                this.setState({filteredData: [], noDataMessage: "Error occurred while getting Variable Definitions"});
            });
    };

    getSingleVariableDefinitionData = () => {
        if (this.state.search.length === 0) {
            return;
        }
        getVariableDefinitions(this.state.search.toUpperCase())
            .then(r => {
                (isDevEnv() && console.log(r));
                if (r.message !== "no data found") {
                    this.setState({filteredData: r});
                } else this.setState({
                    filteredData: [],
                    noDataMessage: "Variable: " + this.state.search + ", could not be found"
                });
            })
            .catch(error => {
                (isDevEnv() && console.log(error));
                this.setState({filteredData: [], noDataMessage: "Error occurred while searching for Variable"});
            });
    };

    noDataMessage = "No Variable Definitions matching this criteria";

    viewAll = () => {
        this.setState({filteredData: this.state.data, search: ""});
    };

    handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({search: e.target.value});
        if (e.target.value.length === 0) {
            this.setState({filteredData: this.state.data});
        }
    };

    render() {
        return (
            <DocumentTitle title={"LFS View Variable Definitions"}>
                <>
                    <ONSTextInput value={this.state.search} label={"Filter by Variable Name"}
                                  onChange={this.handleSearch}/>
                    <ONSButton label={"Search"} primary={true} small={false} field={true}
                               onClick={this.getSingleVariableDefinitionData}/>
                    <ONSButton label={"View All"} primary={false} small={false} field={true}
                               onClick={this.viewAll}/>
                    <ONSAccordionTable data={this.state.filteredData} Row={VarDefTableRow}
                                       expandedRowEnabled={false}
                                       noDataMessage={this.state.noDataMessage}
                                       Headers={VARIABLE_DEFINITION_HEADERS}
                                       pagination={true}
                                       paginationSize={20}
                                       scrollable={true}/>
                </>
            </DocumentTitle>
        );
    }
}

const VarDefTableRow = (rowData: any) => {
    let row: VariableDefinitionTableRow = rowData.row;
    return (
        <>
            <td className="table__cell ">
                {row.variable}
            </td>
            <td className="table__cell ">
                {row.description.Valid ? row.description.String : "No Description Provided"}
            </td>
            <td className="table__cell ">
                {dateFormatter(row.validFrom).format("DD/MM/YYYY")}
            </td>
            <td className="table__cell ">
                <ONSCheckbox id={"editable"} checked={row.editable} disabled={true}/>
            </td>
            <td className="table__cell ">
                <ONSCheckbox id={"expanded"} checked={row.expanded} disabled={true}/>
            </td>
            <td className="table__cell ">
                <ONSCheckbox id={"imputation"} checked={row.imputation} disabled={true}/>
            </td>
            <td className="table__cell ">
                <ONSCheckbox id={"dv"} checked={row.dv} disabled={true}/>
            </td>
        </>
    );
};

// const VarDefExpandedRow = (rowData: any) => {
//     let row: VariableDefinitionTableRow = rowData.row;
//     return (
//         <>
//             <ONSButton label={"Manage Batch"} primary={true} small={false} onClick={() => {
//                 window.location.href = "/View_Monthly_Batch/" + row.type.toLowerCase() + "/" + row.year + "/" + row.period
//             }}/>
//         </>
//     )
//
// };

