import { Button, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import GenericTable from "../../../components/table/GenericTable";
import { TableType } from "../../../components/table/TableDownloadButton";
import TableHeaderButtons from "../../../components/table/TableHeaderButtons";
import { ClusterFinderConfig } from "../../../const/ClusterFinderConstants";

/** @typedef {import("../../const/ClusterFinderConstants").ClusterSearch} ClusterSearch */

const MAX_USAGES = ClusterFinderConfig.MAX_USAGES_DISPLAY;

/* eslint-disable react/prop-types -- PropTypes dependency is not present */
/**
 * @param {ClusterSearch} data
 */
export default function ClusterFinderTable({data}) {
  const {t} = useTranslation();

  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedUsages, setExpandedUsages] = useState({});

  const totalFrequency = useMemo(() => {
    if (!data?.clusters) {
      return 0;
    }
    return data.clusters.reduce((acc, curr) => acc + curr.frequency, 0);
  }, [data]);

  const decodeMarkups = useCallback((value) => {
    if (!value) {
      return "";
    }
    return String(value)
      .replaceAll("_", "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
  }, []);

  const formatFrequencyPercentage = useCallback((frequency) => {
    if (totalFrequency === 0) {
      return "0.00%";
    }
    return ((frequency * 100) / totalFrequency).toFixed(2) + "%";
  }, [totalFrequency]);

  const toggleUsages = useCallback((id) => {
    setExpandedUsages((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const renderUsagesCell = useCallback((props) => {
    const row = props.row.original;
    if (!row?.usages?.length) {
      return null;
    }

    const isExpanded = expandedUsages[props.row.id];
    const usagesToShow = isExpanded ? row.usages : row.usages.slice(0, MAX_USAGES);

    return (
      <div>
        {usagesToShow.map((usage, i) => {
          const isLast = i === usagesToShow.length - 1;
          const showButton = isLast && row.usages.length > MAX_USAGES;

          return (
            <div key={`${usage}-${i}`}>
              {usage}

              {showButton && (
                <Button
                  onClick={() => toggleUsages(props.row.id)}
                  sx={{minWidth: "auto", mb: 0.5, ml: 1, p: 0}}
                >
                  {isExpanded ? "<" : ">"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    )
  }, [expandedUsages, toggleUsages]);

  const columns = useMemo(() => [
    {
      id: "markups",
      header: t("cluster_finder_header_markups"),
      accessorFn: (row) => row.markups ? row.markups.map(decodeMarkups).join(" + ") : ""
    },
    {
      id: "description",
      header: t("cluster_finder_header_description"),
      accessorFn: (row) => row.descriptions ? row.descriptions.join(" + ") : ""
    },
    {
      id: "frequency",
      header: t("common_header_frequency"),
      accessorKey: "frequency"
    },
    {
      id: "percentage",
      header: t("common_header_percentage"),
      accessorFn: (row) => formatFrequencyPercentage(row.frequency)
    },
    {
      id: "usages",
      header: t("cluster_finder_header_usages"),
      accessorFn: (row) => row.usages ? row.usages.join("\n") : "",
      cell: renderUsagesCell
    }
  ], [t, decodeMarkups, formatFrequencyPercentage, renderUsagesCell]);

  if (!data?.clusters?.length) {
    return null;
  }

  const downloadAccessors = columns.map((column) => column.id);
  const downloadHeaders = columns.map((column) => column.header);
  const downloadData = data.clusters.map((cluster) => ({
    markups: cluster.markups ? cluster.markups.map(decodeMarkups).join(" + ") : "",
    description: cluster.descriptions ? cluster.descriptions.join(" + ") : "",
    frequency: cluster.frequency,
    percentage: formatFrequencyPercentage(cluster.frequency),
    usages: cluster.usages ? cluster.usages.join(",") : ""
  }));

  const renderSearchFilter = () => (
    <TextField
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder={t("common_search")}
      size="small"
      sx={{
        width: "200px",
        "& .MuiInputBase-root": {
          marginBottom: "0 !important"
        }
      }}
      type="search"
      value={globalFilter}
    />
  );

  return (
    <>
      <TableHeaderButtons
        downloadAccessors={downloadAccessors}
        downloadData={downloadData}
        downloadHeaders={downloadHeaders}
        downloadTableType={TableType.CLUSTER_FINDER}
        rightComponent={renderSearchFilter()}
      />

      <GenericTable
        columns={columns}
        data={data.clusters}
        sortByColumnId="frequency"
        sortByDesc={true}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
    </>
  );
}
