import React, { useState, useContext, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { apiRequest, jAlert, log, jLog } from "api";
import { Modal } from "semantic-ui-react";
import LoadingOverlay from "components/LoadingOverlay";
import { SessionContext } from "components/SessionContext";

export const ReportController = ({ reportOpen, setReportOpen }) => {
  // eventState0 l'intero oggetto da modificare
  const [loading, setLoading] = useState(false);
  const { user, deskParam, lottiToPrint } =
    useContext(SessionContext).sessionInfo;

  const openPrintDesk = async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      setLoading(true);
      const resut = await exportXlsx(
        "deskreport",
        deskParam,
        getNomeFileExcel(deskParam),
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
    } finally {
    }
  };

  const openPrintStampi = async (event,aItem) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    try {
      const resut = await downloadPdf(
        "stampi",
        aItem,
        getNomeFileStampi(aItem),
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
      setLoading(false);
    } finally {
    }
  };
 
  const openPrintMaterie = async (event,flag,aItem) => {
    setLoading(true);
    try {
      const resut = await downloadPdf(
        "matprime",
        aItem+"_"+flag,
        getNomeFileMaterie(aItem,flag),
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
      setLoading(false);
    } finally {
    }
  };

  const openPrintMaterieNL = async (event,flag,aItem) => {
    setLoading(true);
    try {
      const resut = await downloadPdf(
        "matprime_nl",
        aItem+"_"+flag,
        getNomeFileMaterie(aItem,flag),
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
      setLoading(false);
    } finally {
    }
  };
  const test = async () => {
    try {
      setLoading(true);
      const resut = await downloadPdf(
        "testpdf",
        "",
        getNomeFileStampi("test"),
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
    } finally {
    }
  };
  async function downloadPdf(apicmd, data, nomeFile, endProcessCallback) {
    openBackendData(
      apicmd,
      true,
      nomeFile,
      "application/pdf",
      data,
      endProcessCallback
    );
  }
  const getNomeFileStampi = (aLotto) => {
    return "stampiPdf_" + aLotto + ".pdf";
  };
  
  const getNomeFileMaterie = (aLotto,esseIsLievitati) => {
    if(esseIsLievitati==="S")
       return "MPLievitatiPdf_" + aLotto + ".pdf";
    return "MPTortineBiscottiPdf_" + aLotto + ".pdf";   
  };

  const getNomeFileExcel = (aParam) => {
    return (
      "Lavagna_20" +
      aParam.weekNumber.substring(0, 2) +
      "_" +
      aParam.weekNumber.substring(2) +
      ".xlsx"
    );
  };

  const closeOverlay = () => {
    setReportOpen(false);
  };

  async function exportXlsx(apicmd, data, nomeFile, endProcessCallback) {
    openBackendData(
      apicmd,
      true,
      nomeFile,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      data,
      endProcessCallback
    );
  }
  async function openBackendData(
    apicmd,
    download,
    filename,
    mimetype,
    data,
    endProcessCallback
  ) {
    apiRequest({
      method: "post",
      url: "/" + apicmd,
      headers: {
        Accept: mimetype + ", text/plain, */*",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      data: data,
      user: user,
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: mimetype })
        );
        if (download) {
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const w = window.open(
            url,
            // "_blank",
            "scrollbars=no,menubar=no,height=" +
              window.screen.availHeight +
              ",width=" +
              window.screen.availWidth +
              ",resizable=yes,toolbar=no,status=no"
          ); //"width="+screen.availWidth+",height="+screen.availHeight

          if (w) {
            setTimeout(() => {
              const d = w.document;
              d.title = filename;
              const h = d
                .getElementsByTagName("html")[0]
                .getElementsByTagName("head")[0];
              if (!h.getElementsByTagName("title").length) {
                h.appendChild(document.createElement("title"));
              }
              h.getElementsByTagName("title")[0].innerText = filename;
            }, 300);
          }
        }
      })
      .finally(() => endProcessCallback && endProcessCallback());
  }

  return (
    <Modal
      className="desk-overlay-panel"
      //mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
      size="mini"
      onClose={() => closeOverlay()}
      poppermodifiers={[
        {
          name: "preventOverflow",
          options: {
            boundariesElement: "window",
          },
        },
      ]}
      open={reportOpen}
    >
      <div className="content" style={{ backgroundColor:"white",height:500 }}>
        <span>Stampe disponibili</span>
        <div
          style={{
            textAlign: "center",
            width: "100%",
            border: "1px solid black",
            borderRadius: "14px",
            padding: 15,
            height: 400,
            marginTop:5,
            overflowY:'scoll',overflowX:'none'
          }}
        >
          {deskParam && !loading && (
            <Button
              fluid
              className="overBolder"
              onClick={(event) => { openPrintDesk(event);}}
              style={{ backgroundColor: "orange", border: "2px solid black" }}
            >
              Stampa lavagna corrente
            </Button>
          )}
          <p></p>
          {!loading &&
            lottiToPrint.map((item, index) => {
              return (
                <>
                <Button
                  key={index}
                  fluid
                  className="overBolder"
                  onClick={(event) => {
                    openPrintStampi(event,item);
                  }}
                  style={{
                    backgroundColor: "#adffc6",
                    border: "2px solid black",
                    cursor:'hand', marginBottom: 5,
                  }}
                >
                  Elenco stampi lotto {item}
                </Button>
                
                <Button
                key={index}
                fluid
                className="overBolder"
                onClick={(event) => {
                  openPrintMaterie(event,'S',item);
                }}
                style={{
                  backgroundColor: "#dfe1f7",
                  border: "2px solid black",
                  cursor:'hand', marginBottom: 5,
                }}
              >
                Materie prime lievitati {item}
              </Button>
              <Button
                key={index}
                fluid
                className="overBolder"
                onClick={(event) => {
                  openPrintMaterie(event,'N',item);
                }}
                style={{
                  backgroundColor: "#f3faca",
                  border: "2px solid black",
                  cursor:'hand', marginBottom: 5,
                }}
              >
                Materie prime non lievitati {item}
              </Button>

              <Button
                key={index}
                fluid
                className="overBolder"
                onClick={(event) => {
                  openPrintMaterieNL(event,'S',item);
                }}
                style={{
                  backgroundColor: "#dfe1f7",
                  border: "2px solid black",
                  cursor:'hand', marginBottom: 5,
                }}
              >
                Mat. prime senza lotti (lievitati) {item}
              </Button>

              <Button
                key={index}
                fluid
                className="overBolder"
                onClick={(event) => {
                  openPrintMaterieNL(event,'N',item);
                }}
                style={{
                  backgroundColor: "#f3faca",
                  border: "2px solid black",
                  cursor:'hand', marginBottom: 5,
                }}
              >
                Mat. prime senza lotti (non lievitati) {item}
              </Button>

              </>
              );
            })}
          {false && (
            <Button
              fluid
              className="overBolder"
              onClick={(event) => {
                test();
              }}
              style={{
                backgroundColor: "#adffc6",
                border: "2px solid black",
                marginBottom: 5,
              }}
            >
              test
            </Button>
          )}
          {loading && (
            <div
              className="divLotto"
              style={{ border: "0px solid red", width: "100%",paddingLeft:"9%",paddingRight:"10%"}}
            >
              <div style={{ display: "table-row",margin: "0 auto" }}>
                <LoadingOverlay mode={"mini"} showTxt="Export data" />
              </div>
            </div>
          )}
        </div>

        <div className="divLotto">
          <div
            style={{
              display: "table-cell",
              width: "100%",
              textAlign: "center",
              padding: 5,
            }}
          >
            <Button
              fluid
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                closeOverlay();
              }}
              style={{
                backgroundColor: "#edede9",
                color: "black",
                border: "1px solid black",
              }}
            >
              Chiudi
            </Button>
          </div>
        </div>

        <div style={{ display: "table-row" }}>
          <div
            style={{
              display: "table-cell",
              width: "100%",
              textAlign: "center",
              padding: 5,
            }}
          ></div>
        </div>
      </div>
    </Modal>
  );
};
