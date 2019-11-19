import React, {Component} from 'react';
import {ONSPanel} from '../components/ONS_DesignSystem/ONSPanel';
import {ONSButton} from '../components/ONS_DesignSystem/ONSButton';
import {
    getMonth,
    getStatusStyle,
    monthNumberToString,
    qList,
    toUpperCaseFirstChar
} from '../utilities/Common_Functions';
import {ONSMetadata} from '../components/ONS_DesignSystem/ONSMetadata';
import {getBatchData} from "../utilities/http";
import {GenericNotFound} from "./GenericNotFound";
import {ONSStatus} from "../components/ONS_DesignSystem/ONSStatus";
import {ONSAccordionTable} from "../components/ONS_DesignSystem/ONSAccordionTable";
import {BATCH_HEADERS} from "../utilities/Headers";
import DocumentTitle from "react-document-title";
import {Link} from "react-router-dom";

interface State {
    UploadsData: Data | null
    batchType: string,
    year: string,
    period: string,
    returnedData: [] | null,
    metadata: Array<MetaDataListItem>,
    batchFound: boolean,
    summaryOpen: boolean
}

interface MetaDataListItem {
    R: string,
    L: string
}

interface Data {
    Rows: Row,
    Count: number
}

interface Row {
    [key: number]: Cell
}

interface Cell {
    [key: string]: object
}

export class View_Monthly_Batch extends Component <{}, State> {
    displayName = View_Monthly_Batch.name;

    constructor(props: any) {
        super(props);

        this.state = {
            UploadsData: null,
            batchType: props.match.params.batchtype,
            year: props.match.params.year,
            period: props.match.params.period,
            returnedData: null,
            metadata: [],
            batchFound: true,
            summaryOpen: (props.match.params.summary)
        };
        this.getUploads();
        this.updateMetaDataList()
    }

    goToUploadPage = (row: any) => {
        window.location.href = "/surveyUpload/" + row.type.toLowerCase() + "/" + row.week + "/" + row.month + "/" + row.year
    };

    getUploads = () => {
        getBatchData(this.state.batchType, this.state.year, this.state.period)
            .then(r => {
                if (r[0] === undefined) {
                    // Batch does not exist, load not found page
                    this.setState({batchFound: false})
                }
                this.setState({returnedData: r});
                this.updateMetaDataList()
            })
            .catch(error => {
                console.log(error);
                this.setState({batchFound: false});
            });
    };

    formatMetaData() {
        return (
            [{
                L: "Year",
                R: this.state.year.toString(),
            }, {
                L: "Period",
                R: (this.state.batchType === "monthly" ? monthNumberToString(Number(this.state.period)).toString() : this.state.period.toString()),
            }, {
                L: "Status",
                R: "",
            }
            ]
        )
    }

    updateMetaDataList = () => {
        this.setState({metadata: this.formatMetaData()})
    };

    BatchUploadTableRow = (rowData: any) => {
        let row = rowData.row;
        return (
            <>
                <td className="table__cell ">
                    {row.type}
                </td>
                <td className="table__cell ">
                    {row.type === "NI" ?
                        monthNumberToString(+row.month)
                        :
                        "Week " + row.week
                    }
                </td>
                <td className="table__cell ">

                    <ONSStatus label={getStatusStyle(+row.status).text} small={false}
                               status={getStatusStyle(+row.status).colour}/>
                </td>
                <td className="table__cell ">
                    <ONSButton label={"Summary"} primary={false} small={true}/>
                </td>
                <td className="table__cell ">
                    <Link to={"/surveyUpload/" + row.type.toLowerCase() + "/" + row.week + "/" + row.month + "/" + row.year} >
                        <ONSButton label={"Upload"} primary={false} small={true}/>
                    </Link>
                </td>
            </>
        )
    };

    render() {
        return (
            <DocumentTitle title={'LFS Manage Batch ' + monthNumberToString(+this.state.period) + " " + this.state.year}>
                <div className="container">
                    {
                        this.state.batchFound ?
                            <>
                                <div>
                                    <header className="header header--internal">
                                        <p style={{fontWeight: "bold"}}> Manage Monthly Uploads</p>
                                    </header>
                                    <ONSMetadata List={this.state.metadata}/>
                                </div>
                                <div style={{width: "55%"}}>
                                    <ONSAccordionTable Headers={BATCH_HEADERS} data={this.state.returnedData} Row={this.BatchUploadTableRow} expandedRowEnabled={false} noDataMessage={"No Data"}/>
                                    <ONSPanel label="This is the Dashboard" status="info" spacious={false}>
                                        <p>Every File Must be Uploaded to Run Process</p>
                                    </ONSPanel>
                                    <br/>
                                </div>
                                <div>
                                    <ONSButton label="Run Monthly Process" small={false} primary={true} marginRight={10}/>
                                    {(() => {
                                        if (qList.some(item => String(getMonth(this.state.period)) === String(item))) {
                                            return (
                                                <ONSButton label="Run Interim Weighting" small={false} primary={false}/>
                                            )
                                        }
                                    })()}
                                </div>
                            </>
                            :
                            <GenericNotFound label={toUpperCaseFirstChar(this.state.batchType) + " batch Not Found "}/>
                    }
                </div>
            </DocumentTitle>
        );
    }
}
