export function getLabVarsFromURL(url: string) {
  // extract execution site, notebook name and collab name from url
  // example: https://lab.de.ebrains.eu/user-redirect/lab/tree/drive/shared/collab_name/nb_name.ipynb
  const vars = [];
  try {
    if (!url || !url.toLowerCase().includes("lab")) {
      return [];
    }
    // LAB_EXECUTION_SITE
    const re = /lab.(?<LAB_EXECUTION_SITE>.*).ebrains.eu/g;
    const res = re.exec(url);
    if (res && res.groups && res.groups.LAB_EXECUTION_SITE){
      vars.push({key: "LAB_EXECUTION_SITE", value: res.groups.LAB_EXECUTION_SITE});
    }
    if (url && url.toLowerCase().includes("shared")) {
      const url_array = url.split("/");
      let nb_name = url_array.pop();
      nb_name = nb_name.substring(0, nb_name.lastIndexOf('.')) // remove extension
      vars.push({key: "LAB_NB_NAME", value: nb_name});
      const collab_name = url_array.pop();
      vars.push({key: "LAB_COLLAB_NAME", value: collab_name});
    }
  } catch (e) {
    console.error("Error in getLabVarsFromURL", e);
  }
  return vars;
}