import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import {  INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { sendKernelRequestFromNotebook } from './NotebookUtils';
import { getLabVarsFromURL } from "./helpers";

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-ext-query-params',
  autoStart: true,
  requires: [INotebookTracker],
  activate: async (
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
  ) => {
    const url = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    tracker.widgetAdded.connect((_, nbPanel: NotebookPanel ) => {
      nbPanel.sessionContext.ready.then(() => {
      let code = "import os\n";
      // ebrains specific variables
      const collabVars = getLabVarsFromURL(url);
      for (const {key, value} of collabVars) {
        code += `os.environ['${key}']='${value}'\n`;
      }
      // general variables from URL
      for (const [key, value] of searchParams) {
        if (key.startsWith("LAB_")) { // only environment variables starting with LAB_ are accepted
          code += `os.environ['${key}']='${value}'\n`;
        }
      }
      sendKernelRequestFromNotebook(nbPanel, code, null);
    })});

  }
};

export default extension;