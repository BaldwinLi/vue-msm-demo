<template>
    <div style="height: 100%; width: 100%;">
        <button :id="uuid" v-if="type === 'button'" :style="buttonStyle" :class="buttonClass" role="iconpicker"></button>
        <div :id="uuid" v-if="type === 'picker'" role="iconpicker"></div>
    </div>
</template>

<script>
import 'bootstrap/dist/js/bootstrap';
import './bootstrap-iconpicker-1.9.0/js/bootstrap-iconpicker-iconset-all';
import './bootstrap-iconpicker-1.9.0/js/bootstrap-iconpicker';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'icon-picker',
    data() {
        return {
            uuid: Date.now().toString() + _.uniqueId(),
            target: null
        }
    },
    props:{
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'button'
        },
        buttonClass: {
            type: String,
            default: 'btn btn-default'
        },
        buttonStyle: {
            type: Object,
            default() {
                return {
                    width: '95%',
                    float: 'left'
                }
            }
        },
        options: {
            type: Object,
            default() { 
                return {
                    align: 'center',
                    arrowClass: 'btn-primary',
                    arrowPrevIconClass: 'glyphicon glyphicon-arrow-left',
                    arrowNextIconClass: 'glyphicon glyphicon-arrow-right',
                    cols: 4,
                    footer: true,
                    header: true,
                    icon: '',
                    iconset: 'glyphicon',
                    labelHeader: '{0} / {1}',
                    labelFooter: Lang()['label_footer'],
                    placement: 'bottom',
                    rows: 4,
                    search: true,
                    searchText: Lang()['search_icon'],
                    selectedClass: 'btn-warning',
                    unselectedClass: 'btn-default'
                }
            }
        }
    },
    watch: {
        value(val) {
            if(!!val){
                this.setIconset(val.split(' ')[0]);
            this.setIcon(val.split(' ')[1]);
            }
        }
    },
    methods: {
        setAlign(str) {
            if(!_.isString(str)){
                new Error("Align requires a 'String' argument.");
                return false;
            }
            this.options.align = str;
            this.target.iconpicker('setAlign', str);
        },
        setArrowClass(str) {
            if(!_.isString(str)){
                new Error("ArrowClass requires a 'String' argument.");
                return false;
            }
            this.options.arrowClass = str;
            this.target.iconpicker('setArrowClass', str);
        },
        setArrowPrevIconClass(str) {
            if(!_.isString(str)){
                new Error("ArrowPrevIconClass requires a 'String' argument.");
                return false;
            }
            this.options.arrowPrevIconClass = str;
            this.target.iconpicker('setArrowPrevIconClass', str);
        },
        setArrowNextIconClass(str) {
            if(!_.isString(str)){
                new Error("ArrowNextIconClass requires a 'String' argument.");
                return false;
            }
            this.options.arrowNextIconClass = str;
            this.target.iconpicker('setArrowNextIconClass', str);
        },
        setCols(int) {
            if(!_.isInteger(parseInt(int))){
                new Error("Cols requires a 'Integer' argument.");
                return false;
            }
            this.options.cols = int;
            this.target.iconpicker('setCols', parseInt(int));
        },
        setFooter(bool) {
            if(!_.isBoolean(JSON.parse(bool))){
                new Error("Footer requires a 'Boolean' argument.");
                return false;
            }
            this.options.footer = bool;
            this.target.iconpicker('setFooter', JSON.parse(bool));
        },
        setHeader(bool) {
            if(!_.isBoolean(JSON.parse(bool))){
                new Error("Header requires a 'Boolean' argument.");
                return false;
            }
            this.options.header = bool;
            this.target.iconpicker('setHeader', JSON.parse(bool));
        },
        setIcon(str) {
            if(!_.isString(str)){
                new Error("Icon requires a 'String' argument.");
                return false;
            }
            this.options.icon = str;
            this.target.iconpicker('setIcon', str);
        },
        setIconset(value) {
            if(!(_.isString(value) || _.isObject(value))){
                new Error("Iconset requires a 'String'/'Object' argument.");
                return false;
            }
            this.options.iconset = value;
            this.target.iconpicker('setIconset', value);
        },
        setLabelHeader(str) {
            if(!_.isString(str)){
                new Error("LabelHeader requires a 'String' argument.");
                return false;
            }
            this.options.labelHeader = str;
            this.target.iconpicker('setLabelHeader', str);
        },
        setLabelFooter(str) {
            if(!_.isString(str)){
                new Error("LabelFooter requires a 'String' argument.");
                return false;
            }
            this.options.labelFooter = str;
            this.target.iconpicker('setLabelFooter', str);
        },
        setPlacement(str) {
            if(!_.isString(str)){
                new Error("Placement requires a 'String' argument.");
                return false;
            }
            this.options.placement = str;
            this.target.iconpicker('setPlacement', str);
        },
        setRows(int) {
            if(!_.isInteger(parseInt(int))){
                new Error("Rows requires a 'Integer' argument.");
                return false;
            }
            this.options.rows = int;
            this.target.iconpicker('setRows', parseInt(int));
        },
        setSearch(bool) {
            if(!_.isBoolean(JSON.parse(bool))){
                new Error("Search requires a 'Boolean' argument.");
                return false;
            }
            this.options.search = bool;
            this.target.iconpicker('setSearch', JSON.parse(bool));
        },
        setSearchText(str) {
            if(!_.isString(str)){
                new Error("SearchText requires a 'String' argument.");
                return false;
            }
            this.options.searchText = str;
            this.target.iconpicker('setSearchText', str);
        },
        setSelectedClass(str) {
            if(!_.isString(str)){
                new Error("SelectedClass requires a 'String' argument.");
                return false;
            }
            this.options.selectedClass = str;
            this.target.iconpicker('setSelectedClass', str);
        },
        setUnselectedClass(str) {
            if(!_.isString(str)){
                new Error("UnselectedClass requires a 'String' argument.");
                return false;
            }
            this.options.unselectedClass = str;
            _.isString(str) && this.target.iconpicker('setUnselectedClass', str);
        },
    },
    mounted() {
        let scope = this;
        if(!['button', 'picker'].includes(this.type)) {
            new Error("iconpicker is not one of 'button' and 'picker'");
            return false
        }
        
        this.target = $('#' + this.uuid);
        this.target.iconpicker(this.options);

        this.target.on('change',(e)=>{
            scope.$emit('input', e.icon === 'empty'? '' : `${scope.options.iconset} ${e.icon}`);
            scope.$emit('change', e.icon === 'empty'? '' : `${scope.options.iconset} ${e.icon}`);
        });
    }
}
</script>

<style src="bootstrap/dist/css/bootstrap.min.css" scoped></style>
<style src="./bootstrap-iconpicker-1.9.0/css/bootstrap-iconpicker.css" scoped></style>
<style>
.popover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3060;
    display: none;
    max-width: 276px;
    padding: 1px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    line-break: auto;
    line-height: 1.42857143;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    white-space: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
    font-size: 14px;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.btn .caret {
    margin-left: 5px;
}
</style>