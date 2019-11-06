import React, {Component, Fragment} from "react";

interface Props {
    List : any
    RightList? : any
}

export class ONSMetadata extends Component < Props, {} > {
    
    render () {
        if (this.props.List !== null) {
            return(
                <div>
                    <dl className="metadata metadata__list grid grid--gutterless u-cf u-mb-l" title="This is an example of the metadata component" aria-label="This is an example of the metadata component">
                        {this.props.List.map((item:any) => (
                            <Fragment key ={item.L}>
                                <dt className="metadata__term grid__col col-2@m">{item.L}:</dt>
                                <dd className="metadata__value grid__col col-10@m">{item.R}</dd>
                            </Fragment>)
                        )}
                    </dl>
                </div>
            )
        }

    }
}