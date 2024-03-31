import { PainterTextElementOption, PainterTextElement } from "./element-text";
import { PainterTextBlockElementOption, PainterTextBlockElement } from "./element-text-block";
import { PainterImageElementOption, PainterImageElement } from "./element-image";
import { PainterLineElementOption, PainterLineElement } from "./element-line";
import { PainterRectagleElementOption, PainterRectagleElement } from "./element-rect";
import { PainterContainerElementOption, PainterContainerElement } from "./element-container";
import { PainterClipElementOption, PainterClipElement } from "./element-clip";
import { PainterTransformElementOption, PainterTransformElement } from "./element-transform";
import Painter from "../painter";
import { PainterElement } from "./base";
export declare type BuiltInPainterElementOption = PainterTextElementOption | PainterTextBlockElementOption | PainterImageElementOption | PainterLineElementOption | PainterRectagleElementOption | PainterContainerElementOption | PainterClipElementOption | PainterTransformElementOption;
export declare function createElement(painter: Painter, option: BuiltInPainterElementOption, parent?: PainterElement): PainterTextElement | PainterTextBlockElement | PainterImageElement | PainterLineElement | PainterRectagleElement | PainterContainerElement | PainterClipElement | PainterTransformElement;