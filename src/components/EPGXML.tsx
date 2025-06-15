import { useEffect } from "react";
import { Channel, Program } from "planby";
import usePlanby from "../hooks/usePlanby";

const EPGXML = () => {
  const { channels, epg, isLoading, error } = usePlanby();

  useEffect(() => {
    if (!isLoading && !error) {
      const xml = generateXMLTV(channels, epg);
      const blob = new Blob([xml], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal y hacer clic en él para descargar
      const a = document.createElement("a");
      a.href = url;
      a.download = "epg.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }, [channels, epg, isLoading, error]);

  if (isLoading) {
    return <div>Cargando EPG...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

const generateXMLTV = (channels: Channel[], programs: Program[]): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tv SYSTEM "http://www.xmltv.org/xmltv.dtd">
<tv generator-info-name="Claro Video EPG">
${channels
  .map(
    (channel) => `
  <channel id="${channel.uuid}">
    <display-name>${channel.title}</display-name>
    ${channel.logo ? `<icon src="${channel.logo}" />` : ""}
  </channel>`
  )
  .join("")}
${programs
  .map(
    (program) => `
  <programme channel="${program.channelUuid}" start="${program.since}" stop="${
      program.till
    }">
    <title>${program.title}</title>
    ${program.description ? `<desc>${program.description}</desc>` : ""}
    ${program.image ? `<icon src="${program.image}" />` : ""}
  </programme>`
  )
  .join("")}
</tv>`;

  return xml;
};

export default EPGXML;
