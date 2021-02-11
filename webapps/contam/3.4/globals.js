if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.Globals = {};

CONTAM.Globals.versions = ["1.0","2.0","2.1","2.2","2.3", "2.4", "3.0", "3.1", "3.2", "3.3", "3.4" ];   /* old versions first */
CONTAM.Globals.cversion = 10;     /* current version: index to _versions */
CONTAM.Globals.revision = ' '; /* current revision character; ' ' for 0th revision */
CONTAM.Globals.simfileID=24;   /* the number in the beginning of the sim file that ContamW should check for compatibility */


CONTAM.Globals.WALL = -3;    /* indicate a wall in the _Zones array */
CONTAM.Globals.AMBT = -1;    /* indicate ambient zone in the _Zones array */
CONTAM.Globals.ZNDF = -2;    /* indicate region with undefined zone icom */

CONTAM.Globals.flte_names   /* filter element names in data type order */
= [ "cef", "pf0", "gf0", "uv1", "spf" ];

/*  filter element data types - match ContamX 2.2!! */
CONTAM.Globals.FL_CEF = 0;
CONTAM.Globals.FL_PF0 = 1;
CONTAM.Globals.FL_GF0 = 2;
CONTAM.Globals.FL_UV1 = 3;
CONTAM.Globals.FL_SPF = 4;

CONTAM.Globals.csse_names   /* source/sink names in data type order */
  = [ "ccf", "prs", "cut", "eds", "bls", "brs", "dvs", "drs", 
      "dvr",                                     // 2.4d
      "sup", "plm", "pkm", "sxd", "dxd"  ];  // 2.4b

/* S/S Element types: CSE_DAT.ctype */

CONTAM.Globals.CS_CCF =  0;
CONTAM.Globals.CS_PRS =  1;
CONTAM.Globals.CS_CUT =  2;
CONTAM.Globals.CS_EDS =  3;
CONTAM.Globals.CS_BLS =  4;
CONTAM.Globals.CS_BRS =  5;    /* 1999/03/20 */
CONTAM.Globals.CS_DVS =  6;
CONTAM.Globals.CS_DRS =  7;    /* 2004/06/03 */
CONTAM.Globals.CS_DVR =  8;    /* 2009/04/01 */
CONTAM.Globals.CS_SUP =  9;    /* 2006/03/30 */
CONTAM.Globals.CS_PLM = 10;
CONTAM.Globals.CS_PKM = 11;
CONTAM.Globals.CS_SXD = 12;    /* 2005/09/23 No CW interface yet */
CONTAM.Globals.CS_DXD = 13;

  /* input identifiers - match ContamW!! */
CONTAM.Globals.afe_dnames   /* flow element names in data type order */
  = [
    "plr_orfc" , "plr_leak1", "plr_leak2", "plr_leak3", 
    "plr_conn" , "plr_qcn"  , "plr_fcn"  , "plr_test1",
    "plr_test2", "plr_crack", "plr_stair", "plr_shaft", 
    "plr_bdq"  , "plr_bdf"  , "srv_jwa"  , "qfr_qab", 
    "qfr_fab"  , "qfr_crack", "qfr_test2", "dor_door", 
    "dor_pl2"  , "fan_cmf"  , "fan_cvf"  , "fan_fan", 
    "csf_fsp"  , "csf_qsp"  , "csf_psf"  , "csf_psq", 
    "sup_afe"  , "dct_dwc"  , "dct_plr"  , "dct_fcn",
    "dct_qcn"  , "dct_fan"  , "dct_cmf"  , "dct_cvf",
    "dct_bdq"  , "dct_bdf"  , "dct_fsp"  , "dct_qsp", 
    "dct_psf"  , "dct_psq"
    ];

/*  airflow element data types */

CONTAM.Globals.PL_ORFC  = 0;
CONTAM.Globals.PL_LEAK1 = 1;
CONTAM.Globals.PL_LEAK2 = 2;
CONTAM.Globals.PL_LEAK3 = 3;
CONTAM.Globals.PL_CONN  = 4;
CONTAM.Globals.PL_QCN   = 5;
CONTAM.Globals.PL_FCN   = 6;
CONTAM.Globals.PL_TEST1 = 7;
CONTAM.Globals.PL_TEST2 = 8;
CONTAM.Globals.PL_CRACK = 9;
CONTAM.Globals.PL_STAIR = 10;
CONTAM.Globals.PL_SHAFT = 11;
CONTAM.Globals.PL_BDQ   = 12;
CONTAM.Globals.PL_BDF   = 13;
CONTAM.Globals.SR_JWA   = 14;   // Self Regulating - JW Axley  3.0a
CONTAM.Globals.QF_QAB   = 15;
CONTAM.Globals.QF_FAB   = 16;
CONTAM.Globals.QF_CRACK = 17;
CONTAM.Globals.QF_TEST2 = 18;
CONTAM.Globals.DR_DOOR  = 19;
CONTAM.Globals.DR_PL2   = 20;
CONTAM.Globals.FN_CMF   = 21;
CONTAM.Globals.FN_CVF   = 22;
CONTAM.Globals.FN_FAN   = 23;
CONTAM.Globals.CS_FSP   = 24;
CONTAM.Globals.CS_QSP   = 25;
CONTAM.Globals.CS_PSF   = 26;
CONTAM.Globals.CS_PSQ   = 27;
CONTAM.Globals.AF_SUP   = 28;
CONTAM.Globals.DD_DWC   = 29;
CONTAM.Globals.DD_PLR   = 30;
CONTAM.Globals.DD_FCN   = 31;
CONTAM.Globals.DD_QCN   = 32;
CONTAM.Globals.DD_FAN   = 33;
CONTAM.Globals.DD_CMF   = 34;
CONTAM.Globals.DD_CVF   = 35;
CONTAM.Globals.DD_BDQ   = 36;
CONTAM.Globals.DD_BDF   = 37;
CONTAM.Globals.DD_FSP   = 38;
CONTAM.Globals.DD_QSP   = 39;
CONTAM.Globals.DD_PSF   = 40;
CONTAM.Globals.DD_PSQ   = 41;

CONTAM.Globals.ctrl_names   /* control element names in data type order */
  = [ "sns", "sch", "set", 
      "cvf", "dvf", "log", "pas",
      "mod", "hys", "abs", "bin",
      "dls", "dlx", "int", "rav",
      "inv", "and",  "or", "xor",
      "add", "sub", "mul", "div",
      "sum", "avg", "max", "min",
      "lls", "uls", "lbs", "ubs",
      "llc", "ulc", "pc1", "pi1",
      "sup", "sns",  // sns needed here for place holder
      "exp", "lgn", "lg1", 
      "pow", "sqt", "ply", 
      "sin", "cos", "tan", 
      "mdu", "cel", "flr", 
      "sph"
    ];

CONTAM.Globals.CT_SNS = 0;     /* sensor */
CONTAM.Globals.CT_PHT = 0;     /* phantom control node - for type selection */
CONTAM.Globals.CT_SCH = 1;     /* value from schedule */
CONTAM.Globals.CT_SET = 2;     /* constant value */
CONTAM.Globals.CT_CVF = 3;     /* value from continuous values file - CVF */
CONTAM.Globals.CT_DVF = 4;     /* value from discrete values file - DVF */
/*  single input controls */
CONTAM.Globals.CT_LOG = 5;     /* write value to log file */
CONTAM.Globals.CT_PAS = 6;     /* pass signal (splitter) */
CONTAM.Globals.CT_MOD = 7;     /* modify signal */
CONTAM.Globals.CT_HYS = 8;     /* hysteresis parameter */
CONTAM.Globals.CT_ABS = 9;     /* absolute value of signal */
CONTAM.Globals.CT_BIN = 10;     /* convert signal to binary */
CONTAM.Globals.CT_DLS = 11;     /* delay by schedule */
CONTAM.Globals.CT_DLX = 12;     /* delay by exponential */
/*  binary input control */
CONTAM.Globals.CT_INT = 13;     /* time integral of in1; in2 as control */
/*  single input controls */
CONTAM.Globals.CT_RAV = 14;     /* running average */
CONTAM.Globals.CT_INV = 15;     /* invert (NOT) signal */
/*  binary input controls */
CONTAM.Globals.CT_AND = 16;     /* AND 2 signals */
CONTAM.Globals.CT_OR  = 17;     /* OR 2 signals */
CONTAM.Globals.CT_XOR = 18;     /* XOR 2 signals */
CONTAM.Globals.CT_ADD = 19;     /* add 2 signals */
CONTAM.Globals.CT_SUB = 20;     /* subtract signals: out = in1 - in2 */
CONTAM.Globals.CT_MUL = 21;     /* multiple 2 signals */
CONTAM.Globals.CT_DIV = 22;     /* divide signals: out = in1 / in2 */
/*  multi-input controls */
CONTAM.Globals.CT_SUM = 23;     /* sum multiple signals */
CONTAM.Globals.CT_AVG = 24;     /* average multiple signals */
CONTAM.Globals.CT_MAX = 25;     /* maximum of multiple signals */
CONTAM.Globals.CT_MIN = 26;     /* minimum of multiple signals */
/*  binary input controls */
CONTAM.Globals.CT_LLS = 27;     /* lower limit switch */
CONTAM.Globals.CT_ULS = 28;     /* upper limit switch */
CONTAM.Globals.CT_LBS = 29;     /* lower band switch */
CONTAM.Globals.CT_UBS = 30;     /* upper band switch */
CONTAM.Globals.CT_LLC = 31;     /* lower limit control */
CONTAM.Globals.CT_ULC = 32;     /* upper limit control */
/*  single input controls */
CONTAM.Globals.CT_PC1 = 33;     /* proportional control */
CONTAM.Globals.CT_PI1 = 34;     /* proportional-integral control */

/*  super node */
CONTAM.Globals.CT_SUP = 35;     /* super node */
CONTAM.Globals.CT_SEN = 36;     /* sensor type for type dialog only */

CONTAM.Globals.CT_EXP = 37;     /* exp() */         // 2.4c
CONTAM.Globals.CT_LGN = 38;     /* natural log */
CONTAM.Globals.CT_LG1 = 39;     /* log base 10 */
CONTAM.Globals.CT_POW = 40;     /* pow() */
CONTAM.Globals.CT_SQT = 41;     /* square root */
CONTAM.Globals.CT_PLY = 42;     /* polynomial */
CONTAM.Globals.CT_SIN = 43;     /* sine */
CONTAM.Globals.CT_COS = 44;     /* cosine */
CONTAM.Globals.CT_TAN = 45;     /* tangent */
CONTAM.Globals.CT_MDU = 46;     /* modulo */
CONTAM.Globals.CT_CEL = 47;     /* ceiling */
CONTAM.Globals.CT_FLR = 48;     /* floor */

CONTAM.Globals.CT_SPH = 49;     /* phantom sub-node of super element */

CONTAM.Globals.CT_IRS = 50;    /* integrate over reporting time step */ // CX 2.4b
CONTAM.Globals.CT_ARS = 51;    /* average over reporting time step */ // CX 2.4b

/* zone flag bit 1; variable pressure */
CONTAM.Globals.VAR_P  = 0x0001;
CONTAM.Globals.NVAR_P = 0xFFFE;
/* zone flag bit 2; variable contaminants */
CONTAM.Globals.VAR_C = 0x0002;
CONTAM.Globals.NVAR_C = 0xFFFD;
/* zone flag bit 3; variable temperature */
CONTAM.Globals.VAR_T = 0x0004;
CONTAM.Globals.NVAR_T = 0xFFFB;
/* zone flag bit 4; system zone: to avoid zone volume check */
CONTAM.Globals.SYS_N = 0x0008;
//CONTAM.Globals.NSYS_N 0xFFF7
/* zone flag bit 5; un|conditioned space: to compute air change rate */
CONTAM.Globals.UNCZN = 0x0010;   /* flags | UNCZN to indicate unconditioned zone */
CONTAM.Globals.SETCZN = 0xFFEF;   /* flags & SETCZN to indicate conditioned zone */
/* zone flag bit 6; CFD zone */
CONTAM.Globals.CFDZN = 0x0020;   /* flags | CFDZN to set CFD zone / flags & CFDZN to test for CFD zone */
CONTAM.Globals.NCFDZN = 0xFFDF;   /* flags & NCFDZN to unset CFD zone */

CONTAM.Globals.FLAG_N = 0x003F;   /* all zone flag bits, used in PrjRead() */

/***   to set a flag:  flag |= VAR_P 
     to clear a flag:  flag &= NVAR_P
      to test a flag:  test = flag & VAR_P  ***/

/* path flag bit 1; wind pressure */
CONTAM.Globals.WIND  = 0x0001;
CONTAM.Globals.NWIND = 0xFFFE;
/* path flag bits 2 & 3; path may be in WPC file */
CONTAM.Globals.WPC_P = 0x0002;   /* this path uses WPC file pressure */
CONTAM.Globals.WPC_C = 0x0004;   /* this path uses WPC file contaminants */
CONTAM.Globals.WPC_F = 0x0006;   /* this path uses WPC pressure or contaminants */
CONTAM.Globals.NWPC_F = 0xFFF9;   /* &= to clear WPC_F */
/* path flag bit 4; system (supply or return) flow path */
CONTAM.Globals.AHS_S = 0x0008;
/* path flag bit 5; recirculation flow path */
CONTAM.Globals.AHS_R = 0x0010;
/* path flag bit 6; outside air flow path */
CONTAM.Globals.AHS_O = 0x0020;
/* path flag bit 7; exhaust flow path */
CONTAM.Globals.AHS_X = 0x0040;
CONTAM.Globals.AHS_P = 0x0078;  /* any AHS path */
/* path flag bit 7; pressure limits */
CONTAM.Globals.LIM_P = 0x0080;
CONTAM.Globals.NLIM_P = 0xFF7F;  /* &= to clear LIM_P */
/* path flag bit 8; flow limits */
CONTAM.Globals.LIM_F = 0x0100;
CONTAM.Globals.NLIM_F = 0xFEFF;  /* &= to clear LIM_F */
/* path flag bit 9; constant flow fan element */
CONTAM.Globals.FAN_F = 0x0200;
CONTAM.Globals.FLAG_P = 0x03FF;   /* all path flag bits */ // bug_634 2007/09/26