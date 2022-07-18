export interface ProductionItemInterface{
    id:                    number;
    consumption:           string;
    company_id:            Array<number | string>;
    is_produced:           boolean;
    is_user_working:       boolean;
    product_uom_id:        string[];
    production_state:      string;
    production_bom_id:     Array<number | string>;
    qty_producing:         number;
    time_ids:              any[];
    working_state:         string;
    operation_id:          Array<number | string>;
    name:                  string;
    workcenter_id:         Array<number | string>;
    production_id:         Array<number | string>;
    date_planned_start:    boolean;
    date_planned_finished: boolean;
    date_start:            boolean;
    date_finished:         boolean;
    duration_expected:     number;
    duration:              number;
    state:                 string;
    show_json_popover:     boolean;
    json_popover:          boolean;
}