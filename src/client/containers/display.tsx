import * as React from "react";
import * as pbi from 'powerbi-client';
import {useEffect, useRef} from "react";

const Log = Object.freeze({
    logText: (...args) => {
        console.log(...args);
    },
    log: (...args) => {
        console.log(...args);
    }
});

const Display = ({ dashboard, displayId }): JSX.Element => {
    const powerBiPanel = useRef(null);

    useEffect(() => {
        // Read embed application token from textbox
        const txtAccessToken = 'H4sIAAAAAAAEACVWxc7FjLF7l3-bSmGq1EWY8YR3YWZOdd_9flL3Ho1kj8f-7z92-g5zWvzz73_CNRGexMlv-sf0ktTZ431BiPIow3bw9T4lW-5AkQm2mVtee75ShHLrdLdo6hzFyIBU_MNfS-CQgjCfpex9fA8W1oiIButdOVjNuowHNW-tRZJWZsi9jsjUa_9Y1foDkNZ_YhgCvqGKUrXIuwEBKm9YVzjGKVK9OLGBl94Opw49sqG1aYLSj4Vb69Z7yjgOD1G_I5rhibIcQWrDm3pUhGXcF7JZEXHSJ-NznbjcFbttrfr9fgS9z37flYAwGabrK40mlJoCsiccH-WRgfWiG3vjEpaY_WjYy_1mD_2NNMzu0rwC5oBwW7G4iUaGVBXu3IGgAgu4dazsdl7cqHZT7l93iC6ieFzU_XRrWG95NI1budvHs-v8UAQx06AFXn_Hw-qVZFjSb9dRlgAQc3waueLlA7jSh7ON3UhO-Q79IieFcXtMzm3C1L0rzUh0YKwn9BcHjEbp6NWB5E0Zk0DlfZuckMMSbuk9EqEw2R373ffGF1qidb8iBhpAwoHdjQDX4YoU9XJXDwI8HXG9X7uIL6VHPCj0GmhhXXDqwpG8gk6C4acZdq5V2GUrhY-LATcPkOWl4k-RSTnX52eOCe5Fu5aZcfl5HP6zVuPdEga-Lp8eWjHvjeYWi4BGFKema_V3P_rOezq5aKBzcs2QtkYPDdooFE_bMIXBq7l_EWPMsqSNlnXaycAiXwWIjnSIYvub0Z3szEyktjNzXpqKu5KSF6JjwitfYwhL7KC3e1_mrEFVPJuVjv5SSU5y8qRGmfcPGwVBqc9fHuas1oJXwtuAWnTBgp_ck1M-m2oCpo1TYHmmQ_qkST4JkB3f19_d9vSoDSDap9uxm-er_EmcGF4gfFq7cMFtfEf5xGmV8Gk1fUa7wIwjq2_JmZMbjs3Xmx2InpKei6wyDezf8fTHzQ5rqpdd8rtCw9dizZxFQBMgR1YsU8IX6RZ0nQvpPZpZ34Ls-nqjIrdljcHIh6ojCbw2r8HNWAkKx_l1HwNpgpK34xCHBgMF2vUd9HIq2djiKUwx41edhcPTtZc-nlnGj8vi6L5d-vM9ilTuFqQq6qwg33hgiiobvvsln4gfwTjlvv3pIRbuIkN6HgstEn8yfovHgJvs5PuCyIIJCc68CvT1PG-3alfoa_XzizKKFPxRj5szWBNcQWnmVMXGQMJdG1IFWg3eJw-HW_5jC1tspBjC3_Mh9SEtzvhO2YBez-vVAaqGyoXOryJM24cpliQXa2SnYqI6qn3FnjBO05SSJeROeOnaLyPveifBWMhGkVYyc5b9zQayXBH2kdW9jCu9wEmQbHd1lD9BM5cVn3gnn-kFbdZcuXexcrS_vdeYZfoZpDAu00nLsdw8j8ihO4qOTBgCeBAjS8kd4yFIEh8TFQhE0oTyJNtaqS9v-E5QdQwGFMM32zVHc18aGQ8Oj_pJt5YXucGusFVJl3mQkwQWFsqtoB3cPvpBjAh7HKRzP5581ITWIm2HNdp5dzYNWqgZExj_53a98LIpCKGs--LtzdpkBT_zoZftpd-dF4dTz6odtTY-mDAho8V8_OIZxt72dBm6olFSnRkJN-3FHdpm-L0uB6yVlPIoA5pyJnxDQXg7MZdK1G7I-Fpdo7i7Dmd-ImKsmnPY4uzSWWVFw5Da7NVrQpGBK0ZMQNU77ufLnPvER8eCNT7tRDT2572E9k0hd5Ut4ScVv-vvR_qq_rsel8KFNnf-EkRrtCyFuLR7ZYb-zmHOvXwNIn51-AKxGkuJYF3cyFNcWMK-9PIH6FX8qnmcWLWMD8pSzJJHhsFE32_b5zMHd-dKRUeS24HBuCIPaKcY-n0Z62M9yAS4EfP7dg8tC96vr19AZY1YCn-nxD-X0dZ-VHIQwKPRAcyEKZnjuz9JCl0nyRd1gtoS-EkRZh404Tks8jk5eYv2V10auwh7whY63Jk3fHrcc9WsCZ2qRJUx42gszgaCl1IawNHkxEJp4EtZJIpfLUR6lEzHeWvLbo-DEVT84d9U5Z5irXxSdpGhqr8kOr364Dp80sqserYJgohFT0XTnX6YocI1T7yaRqO31c4RFG1DzDzEGtDjmffAG7-sWdxGv0EbGZvSpqI-rFMus2MPt6UnKO7BkVQexo2w1gM_csurzXAYqMamiDD_Usr7jlsVZfxLEdUKKpo_ie6E1ssTfI82Gt-UDl8eggS6t-phdhr4EvS5tLITdrs8U2I31O7H3P_5zz__-ofb3uWYtfL9qyk5oOkUFo8ZIU7kkxcK3lsGTlDywsKKiX-4837GRv7Zyz8Fws7MolJwUF9QBwlJ3Ju3M71b222-c7awnqrKW_qZjJ_fIZd_vOV8IJdevj6IRvMNwoczf_oKPH7scfYsQDAjlCBaTZZhL0j6grxfJZrEXW03UOKdXAr5o28GvYvx3yfpbwPvQhnysJQM3keUL0sJlaTfLV9x80c17TA-5L5vz-zfNePo5yNHOuJvPVyNMtzSSOHABkJk9TqcKkZRdgaEO7E44eZvjsmddH30Q9p_75G7fvd3VoMx5dAbI7yBPiI5-LNKixCgPhHKx0BCGxFwxjLIi8bYgbTyvIk_cRvFOv-j-V2aclOCP5bjkYoCJqDlMsjcaI-QYSW1_6F-bT2lx7mVf7A2U3NNnaS9Djnju2EgjeSJR6ULQZzmB2ey3ezHyknaXUsuQSJ9XFc6dsEJXVXAErge7QeV7_MJSHiRGsPn-IkZ4VUIQg-Nc2bKJvcKX0F0OU5ZQVFhC-X8CafW2t-noiF9vtEpaJVReRca5V4LWDs0WQ687Huu4CydpxEVAE2F8YT4fGBPqhQ_Xhl7Mm-1uvJP3oERNVqJP-2qxZBiTPfVtw5Iv-zXTS819oGVAHGj_KyHDtyimGLwo_nrD5P-9z_JTWL3vybpxDqQhHPJZtqCHPzNtVSjuZj_khVuUutNHO_tK1XGJnFLzU4R_g3yv9YlvcqxtF8Lj9HzddWqPly0kMwfzf_3__q2c2GaCwAA';

// Read embed URL from textbox
        const txtEmbedUrl = 'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19';

// Read report Id from textbox
        const txtEmbedReportId = 'f6bfd646-b718-44dc-a378-b73e6b528204';

// Read embed type from radio
        const tokenType = '1';

// Get models. models contains enums that can be used.
        const models = pbi.models;

// We give All permissions to demonstrate switching between View and Edit mode and saving report.
        const permissions = models.Permissions.All;

// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
        const config: any = {
            type: 'report',
            tokenType: tokenType !== '1' ? models.TokenType.Aad : models.TokenType.Embed,
            accessToken: txtAccessToken,
            embedUrl: txtEmbedUrl,
            id: txtEmbedReportId,
            permissions: permissions,
            settings: {
                panes: {
                    filters: {
                        visible: true
                    },
                    pageNavigation: {
                        visible: true
                    }
                }
            }
        };

// Get a reference to the embedded report HTML element
        const embedContainer = powerBiPanel.current;

// Embed the report and display it within the div container.
        const report = window.powerbi.embed(embedContainer, config);

// Report.off removes a given event handler if it exists.
        report.off("loaded");

// Report.on will add an event handler which prints to Log window.
        report.on("loaded", function () {
            Log.logText("Loaded");
        });

// Report.off removes a given event handler if it exists.
        report.off("rendered");

// Report.on will add an event handler which prints to Log window.
        report.on("rendered", function () {
            Log.logText("Rendered");
        });

        report.on("error", function (event) {
            Log.log(event.detail);

            report.off("error");
        });

        report.off("saved");
        report.on("saved", function (event) {
            Log.log(event.detail);
            if (event.detail.saveAs) {
                Log.logText('In order to interact with the new report, create a new token and load the new report');
            }
        });
    }, []);
    let w = window.innerWidth - 5;
    if (w > 1200) w = 1200;
    let h = window.innerHeight - 5;

    return (
        <div ref={powerBiPanel} style={{
            width: `${w}px`,
            height: `${h}px`
        }}/>
    )
    // return dashboard
    //     ? <iframe
    //         width={w}
    //         height={h}
    //         frameBorder="0"
    //         allowFullScreen
    //         src={dashboard} />
    //     : <h1 className="displayNumber">Display #{displayId} <hr/> Waiting for Controller</h1>
};

export default Display;