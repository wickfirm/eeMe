import React, {Component, FC} from "react";



type defaultProps = {

    channelid: "UCaYhcUwRBNscFNUKTjgPFiA",

    count: "default"
};
const YouTubeSubscribe: FC<defaultProps> = ({ channelid , count }) =>{

 const youtubescript = document.createElement("script");
    const  youtubeSubscribeNode = React.createRef<any>();

    youtubeSubscribeNode?.current?.parentNode?.appendChild(youtubescript);
    // shouldComponentUpdate(nextProps, nextState) {
    //   if (this.props.channelName === nextProps.channelName) {
    //     return false;
    //   }

    //   if (this.props.channelid === nextProps.channelid) {
    //     return false;
    //   }

    //   return true;
    // }



        return (
            <section className="youtubeSubscribe">
                <div
                    ref={youtubeSubscribeNode}
                    className="g-ytsubscribe"
                    data-count={count}
                    data-channelid={channelid}
                />
            </section>
        );

}
export default YouTubeSubscribe;