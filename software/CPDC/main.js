window.pd = {};

pd.UseYaxisRange = false;
pd.Mode1Color = '#5D9EFB';
pd.Mode2Color = '#EC9E15';
pd.Mode3Color = '#D484EF';
pd.CombinedColor = '#579575';
pd.ShowMarkers = true;
pd.CustomBins = false;
pd.NB = 1;
pd.RHOpart = 1200;
pd.RHOair = 1.2041;
pd.DisType1 = 'lognormal';
pd.DisType2 = 'lognormal';
pd.DisType3 = 'lognormal';
pd.NL1 = 106000;
pd.NL2 = 32000;
pd.NL3 = 5.4;
pd.D1 = 0.001;
pd.DN = 10;
pd.Mode = 1;
pd.MG1 = 0;
pd.STDG1 = 0;
pd.M1 = 0;
pd.STD1 = 0;
pd.MG2 = 0;
pd.STDG2 = 0;
pd.M2 = 0;
pd.STD2 = 0;
pd.MG3 = 0;
pd.STDG3 = 0;
pd.M3 = 0;
pd.STD3 = 0;
pd.lnDp = [];
pd.deltad = [];
pd.deltav = [];
pd.Mp = [];
pd.Vrat = [];
pd.Dhi = [];
pd.Dlo = [];
pd.Vhi = [];
pd.Vlo = [];
pd.Vp = [];
pd.Dp = [];
pd.ni1 = [];
pd.deltalnDp = [];
pd.dndlnDp1 = [];
pd.nidlnDp1 = [];
pd.vi1 = [];
pd.dvdlnDp1 = [];
pd.mi1 = [];
pd.dmdlnDp1 = [];
pd.mfi1 = [];
pd.dmfdlnDp1 = [];
pd.U1 = [];
pd.Dbar1 = [];
pd.a1 = [];
pd.dadlnDp1 = [];
pd.ni2 = [];
pd.dndlnDp2 = [];
pd.nidlnDp2 = [];
pd.vi2 = [];
pd.dvdlnDp2 = [];
pd.mi2 = [];
pd.dmdlnDp2 = [];
pd.mfi2 = [];
pd.dmfdlnDp2 = [];
pd.U2 = [];
pd.Dbar2 = [];
pd.a2 = [];
pd.dadlnDp2 = [];
pd.ni3 = [];
pd.dndlnDp3 = [];
pd.nidlnDp3 = [];
pd.vi3 = [];
pd.dvdlnDp3 = [];
pd.mi3 = [];
pd.dmdlnDp3 = [];
pd.mfi3 = [];
pd.dmfdlnDp3 = [];
pd.U3 = [];
pd.Dbar3 = [];
pd.a3 = [];
pd.dadlnDp3 = [];
pd.sumni1 = 0;
pd.sumprod1 = 0;
pd.sumprod12 = 0;
pd.sumni2     = 0;
pd.sumprod2   = 0;
pd.sumprod22  = 0;
pd.sumni3     = 0;
pd.sumprod3   = 0;
pd.sumprod32  = 0;

pd.Run = function ()
{
  if (pd.GetInputs())
    return;
  if (pd.CustomBins)
  {
    if (pd.CheckCustomBins())
    {
      alert('Custom Bins are not defined or defined completely. Redefine the custom bins by clicking the Use Custom Bins button.');
      return;
    }
  }
  pd.Clear();
  pd.CreateArrays();
  pd.Calculate();
  pd.UseYaxisRange = false;
  pd.LoadLibrary();
  pd.LoadCTMFile();
  pd.ShowResults();
  pd.ChangePlot();
}

pd.CheckCustomBins = function ()
{
  var i;

  for (i = 0; i < pd.NB; i++)
  {
    if (pd.Dp[i] === undefined || pd.ni1[i] === undefined)
      return true;
    if (pd.Mode > 1 && pd.ni2[i] === undefined)
      return true;
    if (pd.Mode > 2 && pd.ni3[i] === undefined)
      return true;
  }

  return false;
}

pd.ShowResults = function ()
{
  document.getElementById('resultsbutton').style.display = 'block';
  document.getElementById('contamlib').style.display = 'block';
  document.getElementById('ctmfile').style.display = 'block';
  document.getElementById('plots').style.display = 'block';  
  document.getElementById('resultsheader').style.display = 'block';  
  document.getElementById('resultstables').style.display = 'grid';  
  document.getElementById('mode1plot').style.display = 'block';    
  document.getElementById('mode1calcs').style.display = 'block';    
  
  if(pd.Mode > 1)
  {
    document.getElementById('combinedplot').style.display = 'block';
    document.getElementById('mode2plot').style.display = 'block';
    document.getElementById('mode2calcs').style.display = 'block';    
  }
  else
  {
    document.getElementById('combinedplot').style.display = 'none';
    document.getElementById('mode2plot').style.display = 'none';
    document.getElementById('mode2calcs').style.display = 'none';    
  }
  if(pd.Mode > 2)
  {
    document.getElementById('mode3plot').style.display = 'block';
    document.getElementById('mode3calcs').style.display = 'block';    
  }
  else
  {
    document.getElementById('mode3plot').style.display = 'none';  
    document.getElementById('mode3calcs').style.display = 'none';    
  }
}

pd.GetInputs = function ()
{
  if (!pd.CustomBins)
  {
    pd.NB = parseInt(document.getElementById('nb').value);
    if (isNaN(pd.NB))
    {
      alert('The number of bins is not a valid integer.');
      return true;
    }
    if (pd.NB < 1 || pd.NB > 100)
    {
      alert('The number of bins must be a number from 1 to 100.');
      return true;
    }
  }

  pd.RHOpart = parseFloat(document.getElementById('rhop').value);
  if (isNaN(pd.RHOpart))
  {
    alert(pd.htmlDecode('&rho;') + ' particles is not a valid number.');
    return true;
  }

  pd.RHOair = parseFloat(document.getElementById('rhoa').value);
  if (isNaN(pd.RHOair))
  {
    alert(pd.htmlDecode('&rho;') + ' air is not a valid number.');
    return true;
  }

  if (document.getElementById('lognormal1').checked)
    pd.DisType1 = 'lognormal';
  else if (document.getElementById('normal1').checked)
    pd.DisType1 = 'normal';
  else
  {
    alert('No selection has been made for Distribution Type 1');
    return true;
  }

  if (document.getElementById('lognormal2').checked)
    pd.DisType2 = 'lognormal';
  else if (document.getElementById('normal2').checked)
    pd.DisType2 = 'normal';
  else
  {
    alert('No selection has been made for Distribution Type 2');
    return true;
  }

  if (document.getElementById('lognormal3').checked)
    pd.DisType3 = 'lognormal';
  else if (document.getElementById('normal3').checked)
    pd.DisType3 = 'normal';
  else
  {
    alert('No selection has been made for Distribution Type 3');
    return true;
  }

  pd.NL1 = parseInt(document.getElementById('tnc1').value);
  if (isNaN(pd.NL1))
  {
    alert('The number of total concentrations (mode 1) is not a valid integer.');
    return true;
  }

  pd.NL2 = parseInt(document.getElementById('tnc2').value);
  if (isNaN(pd.NL2))
  {
    alert('The number of total concentrations (mode 2) is not a valid integer.');
    return true;
  }

  pd.NL3 = parseInt(document.getElementById('tnc3').value);
  if (isNaN(pd.NL3))
  {
    alert('The number of total concentrations (mode 3) is not a valid integer.');
    return true;
  }

  pd.D1 = parseFloat(document.getElementById('d1').value);
  if (isNaN(pd.D1))
  {
    alert('The smallest particle diameter is not a valid number.');
    return true;
  }

  pd.DN = parseFloat(document.getElementById('dn').value);
  if (isNaN(pd.DN))
  {
    alert('The largest particle diameter is not a valid number.');
    return true;
  }

  if (document.getElementById('mode1').checked)
    pd.Mode = 1;
  else if (document.getElementById('mode2').checked)
    pd.Mode = 2;
  else if (document.getElementById('mode3').checked)
    pd.Mode = 3;
  else
  {
    alert('No selection has been made for Number of Modes');
    return true;
  }

  var m1, std1;
  m1 = parseFloat(document.getElementById('m1').value);
  if (isNaN(m1))
  {
    alert('Mean (mode 1) is not a valid number.');
    return true;
  }

  std1 = parseFloat(document.getElementById('std1').value);
  if (isNaN(std1))
  {
    alert('STD (mode 1) is not a valid number.');
    return true;
  }

  if (pd.DisType1 === 'lognormal')
  {
    pd.MG1 = m1;
    pd.STDG1 = std1;
  }
  else
  {
    pd.M1 = m1;
    pd.STD1 = std1;
  }

  if (pd.Mode > 1)
  {
    var m2, std2;

    m2 = parseFloat(document.getElementById('m2').value);
    if (isNaN(m2))
    {
      alert('Mean (mode 2) is not a valid number.');
      return true;
    }

    std2 = parseFloat(document.getElementById('std2').value);
    if (isNaN(std2))
    {
      alert('STD (mode 2) is not a valid number.');
      return true;
    }

    if (pd.DisType2 === 'lognormal')
    {
      pd.MG2 = m2;
      pd.STDG2 = std2;
    }
    else
    {
      pd.M2 = m2;
      pd.STD2 = std2;
    }
  }

  if (pd.Mode > 2)
  {
    var m3, std3;
    m3 = parseFloat(document.getElementById('m3').value);
    if (isNaN(m3))
    {
      alert('Mean (mode 3) is not a valid number.');
      return true;
    }

    std3 = parseFloat(document.getElementById('std3').value);
    if (isNaN(std3))
    {
      alert('STD (mode 3) is not a valid number.');
      return true;
    }

    if (pd.DisType3 === 'lognormal')
    {
      pd.MG3 = m3;
      pd.STDG3 = std3;
    }
    else
    {
      pd.M3 = m3;
      pd.STD3 = std3;
    }
  }

  return false;
}

pd.CreateArrays = function ()
{ 
  pd.lnDp      = new Array(pd.NB);
  pd.deltad    = new Array(pd.NB);
  pd.deltav    = new Array(pd.NB);
  pd.Mp        = new Array(pd.NB);
  pd.Vrat      = new Array(pd.NB); 
  pd.Dhi       = new Array(pd.NB);
  pd.Dlo       = new Array(pd.NB);
  pd.Vhi       = new Array(pd.NB);
  pd.Vlo       = new Array(pd.NB);
  pd.Vp = new Array(pd.NB);
  if (!pd.CustomBins)
    pd.Dp        = new Array(pd.NB);

  if (!pd.CustomBins)
    pd.ni1 = new Array(pd.NB);
  pd.deltalnDp = new Array(pd.NB);
  pd.dndlnDp1  = new Array(pd.NB);
  pd.nidlnDp1  = new Array(pd.NB);
  pd.vi1       = new Array(pd.NB);
  pd.dvdlnDp1  = new Array(pd.NB);
  pd.mi1       = new Array(pd.NB);
  pd.dmdlnDp1  = new Array(pd.NB);
  pd.mfi1      = new Array(pd.NB);
  pd.dmfdlnDp1 = new Array(pd.NB);
  pd.U1        = new Array(pd.NB);
  pd.Dbar1     = new Array(pd.NB);
  pd.a1        = new Array(pd.NB);
  pd.dadlnDp1  = new Array(pd.NB);
  
  if(pd.Mode > 1)
  {
    if (!pd.CustomBins)
      pd.ni2 = new Array(pd.NB);
    pd.dndlnDp2  = new Array(pd.NB);
    pd.nidlnDp2  = new Array(pd.NB);
    pd.vi2       = new Array(pd.NB);
    pd.dvdlnDp2  = new Array(pd.NB);
    pd.mi2       = new Array(pd.NB);
    pd.dmdlnDp2  = new Array(pd.NB);
    pd.mfi2      = new Array(pd.NB);
    pd.dmfdlnDp2 = new Array(pd.NB);
    pd.U2        = new Array(pd.NB);
    pd.Dbar2     = new Array(pd.NB);
    pd.a2        = new Array(pd.NB);
    pd.dadlnDp2  = new Array(pd.NB);
  }
  if(pd.Mode > 2)
  {
    if (!pd.CustomBins)
      pd.ni3 = new Array(pd.NB);
    pd.dndlnDp3  = new Array(pd.NB);
    pd.nidlnDp3  = new Array(pd.NB);
    pd.vi3       = new Array(pd.NB);
    pd.dvdlnDp3  = new Array(pd.NB);
    pd.mi3       = new Array(pd.NB);
    pd.dmdlnDp3  = new Array(pd.NB);
    pd.mfi3      = new Array(pd.NB);
    pd.dmfdlnDp3 = new Array(pd.NB);
    pd.U3        = new Array(pd.NB);
    pd.Dbar3     = new Array(pd.NB);
    pd.a3        = new Array(pd.NB);
    pd.dadlnDp3  = new Array(pd.NB);  
  }

}

pd.Calculate = function ()
{
  var i;

  pd.V1 = Math.PI * Math.pow(pd.D1 / 1000000, 3) / 6;
  pd.Vnb = Math.PI * Math.pow(pd.DN / 1000000, 3) / 6;
  pd.Vratio = Math.pow(pd.Vnb / pd.V1, 1 / (pd.NB - 1));
  pd.sumni1 = 0;
  pd.sumprod1 = 0;
  pd.sumprod12 = 0;
  if (pd.Mode > 1)
  {
    pd.sumni2 = 0;
    pd.sumprod2 = 0;
    pd.sumprod22 = 0;
  }
  if (pd.Mode > 2)
  {
    pd.sumni3 = 0;
    pd.sumprod3 = 0;
    pd.sumprod32 = 0;
  }

  if (pd.CustomBins)
  {
    pd.Vp[0] = Math.PI * Math.pow(pd.Dp[0] / 1000000, 3) / 6;
    pd.Dhi[0] = pd.Dp[0] + ((pd.Dp[1] - pd.Dp[0]) / 2);
    pd.Dlo[0] = pd.Dp[0] - ((pd.Dp[1] - pd.Dp[0]) / 2);
    pd.Vlo[0] = Math.PI * Math.pow(pd.Dlo[0] / 1000000, 3) / 6;
    pd.Vhi[0] = Math.PI * Math.pow(pd.Dhi[0] / 1000000, 3) / 6;
    pd.Mp[0] = pd.Vp[0] * pd.RHOpart;
    pd.deltad[0] = pd.Dhi[0] - pd.Dlo[0];
    pd.deltav[0] = pd.Vhi[0] - pd.Vlo[0];
    pd.lnDp[0] = Math.log(pd.Dp[0]);
    pd.Vrat[0] = 0;
  }
  else
  {
    pd.Dp[0] = pd.D1;
    pd.Vp[0] = Math.PI * Math.pow(pd.Dp[0] / 1000000, 3) / 6;
    pd.Vlo[0] = 2 * pd.Vp[0] / (1 + pd.Vratio);
    pd.Dlo[0] = 1000000 * Math.pow(6 * pd.Vlo[0] / Math.PI, 1 / 3);
    pd.Dhi[0] = pd.Dlo[0] * Math.pow(pd.Vratio, 1 / 3);
    pd.Vhi[0] = Math.PI * Math.pow(pd.Dhi[0] / 1000000, 3) / 6;
    pd.Vrat[0] = pd.Vhi[0] / pd.Vlo[0];
    pd.Mp[0] = pd.Vp[0] * pd.RHOpart;
    pd.deltav[0] = 2 * pd.Dp[0] * (pd.Vratio - 1) / (1 + pd.Vratio);
    pd.deltad[0] = pd.Dp[0] * Math.pow(2, 1 / 3) * (Math.pow(pd.Vratio, 1 / 3) - 1) / Math.pow(1 + pd.Vratio, 1 / 3);
    pd.lnDp[0] = Math.log(pd.Dp[0]);
  }

  if (!pd.CustomBins)
  {
    if (pd.DisType1 === 'lognormal')
      pd.ni1[0] = (pd.NL1 * pd.deltad[0] / (pd.Dp[0] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG1))) *
                 Math.exp(-(Math.pow(Math.log(pd.Dp[0] / pd.MG1), 2)) / (2 * Math.pow(Math.log(pd.STDG1), 2)));
    else
      pd.ni1[0] = ((pd.NL1 / (Math.sqrt(2 * Math.PI) * pd.STD1)) * Math.exp(-(Math.pow(pd.Dp[0] - pd.M1, 2) / (2 * pd.STD1 * pd.STD1))));
  }

  pd.sumni1 += pd.ni1[0];
  pd.sumprod1 += pd.ni1[0] * pd.lnDp[0];
  pd.sumprod12 += pd.ni1[0] * pd.Dp[0];
  pd.deltalnDp[0] = Math.log(pd.Dhi[0] / pd.Dlo[0]);
  pd.dndlnDp1[0] = pd.ni1[0] / pd.deltalnDp[0];
  pd.nidlnDp1[0] = parseInt(pd.ni1[0] / pd.deltad[0]);
  pd.vi1[0] = pd.ni1[0] * pd.Vp[0] * 1000000;
  pd.dvdlnDp1[0] = pd.vi1[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
  pd.mi1[0] = pd.RHOpart * pd.vi1[0] * 1000;
  pd.dmdlnDp1[0] = pd.mi1[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
  pd.mfi1[0] = pd.mi1[0] / (1000 * pd.RHOair);
  pd.dmfdlnDp1[0] = pd.mfi1[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
  pd.a1[0] = 4 * Math.PI * Math.pow(pd.Dp[0] / 2, 2) * pd.ni1[0];
  pd.dadlnDp1[0] = pd.a1[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);

  if (pd.Mode > 1)
  {
    if (!pd.CustomBins)
    {
      if (pd.DisType2 === 'lognormal')
        pd.ni2[0] = (pd.NL2 * pd.deltad[0] / (pd.Dp[0] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG2))) *
                   Math.exp(-(Math.pow(Math.log(pd.Dp[0] / pd.MG2), 2)) / (2 * Math.pow(Math.log(pd.STDG2), 2)));
      else
        pd.ni2[0] = ((pd.NL2 / (Math.sqrt(2 * Math.PI) * pd.STD2)) * Math.exp(-(Math.pow(pd.Dp[0] - pd.M2, 2) / (2 * pd.STD2 * pd.STD2))));
    }
    pd.sumni2 += pd.ni2[0];
    pd.sumprod2 += pd.ni2[0] * pd.lnDp[0];
    pd.sumprod22 += pd.ni2[0] * pd.Dp[0];
    pd.dndlnDp2[0] = pd.ni2[0] / pd.deltalnDp[0];
    pd.nidlnDp2[0] = parseInt(pd.ni2[0] / pd.deltad[0]);
    pd.vi2[0] = pd.ni2[0] * pd.Vp[0] * 1000000;
    pd.dvdlnDp2[0] = pd.vi2[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.mi2[0] = pd.RHOpart * pd.vi2[0] * 1000;
    pd.dmdlnDp2[0] = pd.mi2[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.mfi2[0] = pd.mi2[0] / (1000 * pd.RHOair);
    pd.dmfdlnDp2[0] = pd.mfi2[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.a2[0] = 4 * Math.PI * Math.pow(pd.Dp[0] / 2, 2) * pd.ni2[0];
    pd.dadlnDp2[0] = pd.a2[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
  }

  if (pd.Mode > 2)
  {
    if (!pd.CustomBins)
    {
      if (pd.DisType3 === 'lognormal')
        pd.ni3[0] = (pd.NL3 * pd.deltad[0] / (pd.Dp[0] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG3))) *
                   Math.exp(-(Math.pow(Math.log(pd.Dp[0] / pd.MG3), 2)) / (2 * Math.pow(Math.log(pd.STDG3), 2)));
      else
        pd.ni3[0] = ((pd.NL3 / (Math.sqrt(2 * Math.PI) * pd.STD3)) * Math.exp(-(Math.pow(pd.Dp[0] - pd.M3, 2) / (2 * pd.STD3 * pd.STD3))));
    }
    pd.sumni3 += pd.ni3[0];
    pd.sumprod3 += pd.ni3[0] * pd.lnDp[0];
    pd.sumprod32 += pd.ni3[0] * pd.Dp[0];
    pd.dndlnDp3[0] = pd.ni3[0] / pd.deltalnDp[0];
    pd.nidlnDp3[0] = parseInt(pd.ni3[0] / pd.deltad[0]);
    pd.vi3[0] = pd.ni3[0] * pd.Vp[0] * 1000000;
    pd.dvdlnDp3[0] = pd.vi3[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.mi3[0] = pd.RHOpart * pd.vi3[0] * 1000;
    pd.dmdlnDp3[0] = pd.mi3[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.mfi3[0] = pd.mi3[0] / (1000 * pd.RHOair);
    pd.dmfdlnDp3[0] = pd.mfi3[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
    pd.a3[0] = 4 * Math.PI * Math.pow(pd.Dp[0] / 2, 2) * pd.ni3[0];
    pd.dadlnDp3[0] = pd.a3[0] / Math.log(pd.Dhi[0] / pd.Dlo[0]);
  }

  for (i = 1; i < pd.NB; ++i)
  {
    if (pd.CustomBins)
    {
      pd.Vp[i] = Math.PI * Math.pow(pd.Dp[i] / 1000000, 3) / 6;
      if (i < pd.NB - 1)
      {
        pd.Dhi[i] = pd.Dp[i] + ((pd.Dp[i + 1] - pd.Dp[i]) / 2);
        pd.Dlo[i] = pd.Dp[i] - ((pd.Dp[i] - pd.Dp[i - 1]) / 2);
      }
      else
      {
        pd.Dhi[i] = pd.Dp[i] + ((pd.Dp[i] + pd.Dp[i - 1]) / 2);
        pd.Dlo[i] = pd.Dp[i] - ((pd.Dp[i] - pd.Dp[i - 1]) / 2);
      }
      pd.Vlo[i] = Math.PI * Math.pow(pd.Dlo[i] / 1000000, 3) / 6;
      pd.Vhi[i] = Math.PI * Math.pow(pd.Dhi[i] / 1000000, 3) / 6;
      pd.Mp[i] = pd.Vp[i] * pd.RHOpart;
      pd.deltad[i] = pd.Dhi[i] - pd.Dlo[i];
      pd.deltav[i] = pd.Vhi[i] - pd.Vlo[i];
      pd.lnDp[i] = Math.log(pd.Dp[i]);
      pd.Vrat[i] = 0;
    }
    else
    {
      pd.Vlo[i] = pd.Vhi[i - 1];
      pd.Vhi[i] = pd.Vlo[i] * pd.Vratio;
      pd.Vp[i] = 0.5 * (pd.Vlo[i] + pd.Vhi[i]);
      pd.Dp[i] = 1000000 * Math.pow(6 * pd.Vp[i] / Math.PI, 1 / 3);
      pd.Dlo[i] = 1000000 * Math.pow(6 * pd.Vlo[i] / Math.PI, 1 / 3);
      pd.Dhi[i] = pd.Dlo[i] * Math.pow(pd.Vratio, 1 / 3);
      pd.Vrat[i] = pd.Vhi[i] / pd.Vlo[i];
      pd.Mp[i] = pd.Vp[i] * pd.RHOpart;
      pd.deltav[i] = 2 * pd.Dp[i] * (pd.Vratio - 1) / (1 + pd.Vratio);
      pd.deltad[i] = pd.Dp[i] * Math.pow(2, 1 / 3) * (Math.pow(pd.Vratio, 1 / 3) - 1) / Math.pow(1 + pd.Vratio, 1 / 3);
      pd.lnDp[i] = Math.log(pd.Dp[i]);
    }

    if (!pd.CustomBins)
    {
      if (pd.DisType1 === 'lognormal')
        pd.ni1[i] = (pd.NL1 * pd.deltad[i] / (pd.Dp[i] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG1))) *
                   Math.exp(-(Math.pow(Math.log(pd.Dp[i] / pd.MG1), 2)) / (2 * Math.pow(Math.log(pd.STDG1), 2)));
      else
        pd.ni1[i] = ((pd.NL1 / (Math.sqrt(2 * Math.PI) * pd.STD1)) * Math.exp(-(Math.pow(pd.Dp[i] - pd.M1, 2) / (2 * pd.STD1 * pd.STD1))));
    }

    pd.sumni1 += pd.ni1[i];
    pd.sumprod1 += pd.ni1[i] * pd.lnDp[i];
    pd.sumprod12 += pd.ni1[i] * pd.Dp[i];
    pd.deltalnDp[i] = Math.log(pd.Dhi[i] / pd.Dlo[i]);
    pd.dndlnDp1[i] = pd.ni1[i] / pd.deltalnDp[i];
    pd.nidlnDp1[i] = parseInt(pd.ni1[i] / pd.deltad[i]);
    pd.vi1[i] = pd.ni1[i] * pd.Vp[i] * 1000000;
    pd.dvdlnDp1[i] = pd.vi1[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    pd.mi1[i] = pd.RHOpart * pd.vi1[i] * 1000;
    pd.dmdlnDp1[i] = pd.mi1[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    pd.mfi1[i] = pd.mi1[i] / (1000 * pd.RHOair);
    pd.dmfdlnDp1[i] = pd.mfi1[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    pd.a1[i] = 4 * Math.PI * Math.pow(pd.Dp[i] / 2, 2) * pd.ni1[i];
    pd.dadlnDp1[i] = pd.a1[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);

    if (pd.Mode > 1)
    {
      if (!pd.CustomBins)
      {
        if (pd.DisType2 === 'lognormal')
          pd.ni2[i] = (pd.NL2 * pd.deltad[i] / (pd.Dp[i] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG2))) *
                     Math.exp(-(Math.pow(Math.log(pd.Dp[i] / pd.MG2), 2)) / (2 * Math.pow(Math.log(pd.STDG2), 2)));
        else
          pd.ni2[i] = ((pd.NL2 / (Math.sqrt(2 * Math.PI) * pd.STD2)) * Math.exp(-(Math.pow(pd.Dp[i] - pd.M2, 2) / (2 * pd.STD2 * pd.STD2))));
      }
      pd.sumni2 += pd.ni2[i];
      pd.sumprod2 += pd.ni2[i] * pd.lnDp[i];
      pd.sumprod22 += pd.ni2[i] * pd.Dp[i];
      pd.dndlnDp2[i] = pd.ni2[i] / pd.deltalnDp[i];
      pd.nidlnDp2[i] = parseInt(pd.ni2[i] / pd.deltad[i]);
      pd.vi2[i] = pd.ni2[i] * pd.Vp[i] * 1000000;
      pd.dvdlnDp2[i] = pd.vi2[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.mi2[i] = pd.RHOpart * pd.vi2[i] * 1000;
      pd.dmdlnDp2[i] = pd.mi2[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.mfi2[i] = pd.mi2[i] / (1000 * pd.RHOair);
      pd.dmfdlnDp2[i] = pd.mfi2[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.a2[i] = 4 * Math.PI * Math.pow(pd.Dp[i] / 2, 2) * pd.ni2[i];
      pd.dadlnDp2[i] = pd.a2[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    }

    if (pd.Mode > 2)
    {
      if (!pd.CustomBins)
      {
        if (pd.DisType3 === 'lognormal')
          pd.ni3[i] = (pd.NL3 * pd.deltad[i] / (pd.Dp[i] * Math.sqrt(2 * Math.PI) * Math.log(pd.STDG3))) *
                     Math.exp(-(Math.pow(Math.log(pd.Dp[i] / pd.MG3), 2)) / (2 * Math.pow(Math.log(pd.STDG3), 2)));
        else
          pd.ni3[i] = ((pd.NL3 / (Math.sqrt(2 * Math.PI) * pd.STD3)) * Math.exp(-(Math.pow(pd.Dp[i] - pd.M3, 2) / (2 * pd.STD3 * pd.STD3))));
      }
      pd.sumni3 += pd.ni3[i];
      pd.sumprod3 += pd.ni3[i] * pd.lnDp[i];
      pd.sumprod32 += pd.ni3[i] * pd.Dp[i];
      pd.dndlnDp3[i] = pd.ni3[i] / pd.deltalnDp[i];
      pd.nidlnDp3[i] = parseInt(pd.ni3[i] / pd.deltad[i]);
      pd.vi3[i] = pd.ni3[i] * pd.Vp[i] * 1000000;
      pd.dvdlnDp3[i] = pd.vi3[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.mi3[i] = pd.RHOpart * pd.vi3[i] * 1000;
      pd.dmdlnDp3[i] = pd.mi3[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.mfi3[i] = pd.mi3[i] / (1000 * pd.RHOair);
      pd.dmfdlnDp3[i] = pd.mfi3[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
      pd.a3[i] = 4 * Math.PI * Math.pow(pd.Dp[i] / 2, 2) * pd.ni3[i];
      pd.dadlnDp3[i] = pd.a3[i] / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    }
  }
  //done at the end
  pd.lnDbarN1 = pd.sumprod1 / pd.sumni1;
  pd.un1 = pd.sumprod12 / pd.sumni1;
  pd.ugn1 = Math.exp(pd.sumprod1 / pd.sumni1);
  pd.sumu1 = 0;
  pd.sumv1 = 0;
  if (pd.Mode > 1)
  {
    pd.lnDbarN2 = pd.sumprod2 / pd.sumni2;
    pd.un2 = pd.sumprod22 / pd.sumni2;
    pd.ugn2 = Math.exp(pd.sumprod2 / pd.sumni2);
    pd.sumu2 = 0;
    pd.sumv2 = 0;
  }

  if (pd.Mode > 2)
  {
    pd.lnDbarN3 = pd.sumprod3 / pd.sumni3;
    pd.un3 = pd.sumprod32 / pd.sumni3;
    pd.ugn3 = Math.exp(pd.sumprod3 / pd.sumni3);
    pd.sumu3 = 0;
    pd.sumv3 = 0;
  }

  for (i = 0; i < pd.NB; ++i)
  {
    pd.U1[i] = pd.ni1[i] * Math.pow(pd.lnDp[i] - Math.log(pd.ugn1), 2);
    pd.sumu1 += pd.U1[i];
    pd.Dbar1[i] = pd.ni1[i] * Math.pow(pd.Dp[i] - pd.un1, 2);
    pd.sumv1 += pd.Dbar1[i];
    if (pd.Mode > 1)
    {
      pd.U2[i] = pd.ni2[i] * Math.pow(pd.lnDp[i] - Math.log(pd.ugn2), 2);
      pd.sumu2 += pd.U2[i];
      pd.Dbar2[i] = pd.ni2[i] * Math.pow(pd.Dp[i] - pd.un2, 2);
      pd.sumv2 += pd.Dbar2[i];
    }

    if (pd.Mode > 2)
    {
      pd.U3[i] = pd.ni3[i] * Math.pow(pd.lnDp[i] - Math.log(pd.ugn3), 2);
      pd.sumu3 += pd.U3[i];
      pd.Dbar3[i] = pd.ni3[i] * Math.pow(pd.Dp[i] - pd.un3, 2);
      pd.sumv3 += pd.Dbar3[i];
    }
  }
  //
  pd.on1 = Math.sqrt(pd.sumv1 / pd.sumni1);
  pd.ogn1 = Math.exp(Math.sqrt(pd.sumu1 / pd.sumni1));
  if (pd.Mode > 1)
  {
    pd.on2 = Math.sqrt(pd.sumv2 / pd.sumni2);
    pd.ogn2 = Math.exp(Math.sqrt(pd.sumu2 / pd.sumni2));
  }

  if (pd.Mode > 2)
  {
    pd.on3 = Math.sqrt(pd.sumv3 / pd.sumni3);
    pd.ogn3 = Math.exp(Math.sqrt(pd.sumu3 / pd.sumni3));
  }

  pd.AddCalcs();
  for (i = 0; i < pd.NB; ++i)
    pd.AddRow(i);
}

pd.AddCalcs = function()
{
  var thead1  = document.getElementById('calcs1head');
  var newCell = document.createElement('th');
  thead1.appendChild(newCell);
  newCell = document.createElement('th');
  thead1.appendChild(newCell);
  newCell.textContent = 'Total N';
  newCell = document.createElement('th');
  thead1.appendChild(newCell);
  if(pd.DisType1 === 'lognormal')
    newCell.innerHTML = '&micro;<sub>g</sub>';
  else
    newCell.innerHTML = '&micro;';
  newCell = document.createElement('th');
  thead1.appendChild(newCell);
  if(pd.DisType1 === 'lognormal')
    newCell.innerHTML = '&sigma;<sub>g</sub>';
  else
    newCell.innerHTML = '&sigma;';

  var tbody1  = document.getElementById('calcs1');
  var newRow1 = tbody1.insertRow(-1);
  
  newCell = newRow1.insertCell(-1);
  newCell.textContent = 'User:';
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.NL1.toString();
  if(pd.DisType1 === 'lognormal')
  {
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.MG1.toPrecision(4);
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.STDG1.toPrecision(4);
  }
  else
  {
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.M1.toPrecision(4);
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.STD1.toPrecision(4);
  }
  
  if(pd.Mode > 1)
  {
    var thead2  = document.getElementById('calcs2head');
    newCell = document.createElement('th');
    thead2.appendChild(newCell);
    newCell = document.createElement('th');
    thead2.appendChild(newCell);
    newCell.textContent = 'Total N';
    newCell = document.createElement('th');
    thead2.appendChild(newCell);
    if(pd.DisType2 === 'lognormal')
      newCell.innerHTML = '&micro;<sub>g</sub>';
    else
      newCell.innerHTML = '&micro;';
    newCell = document.createElement('th');
    thead2.appendChild(newCell);
    if(pd.DisType2 === 'lognormal')
      newCell.innerHTML = '&sigma;<sub>g</sub>';
    else
      newCell.innerHTML = '&sigma;';
      
    var tbody2  = document.getElementById('calcs2');
    var newRow2 = tbody2.insertRow(-1);
      
    newCell = newRow2.insertCell(-1);
    newCell.textContent = 'User:';
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.NL2.toString();
    if(pd.DisType2 === 'lognormal')
    {
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.MG2.toPrecision(4);
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.STDG2.toPrecision(4);
    }
    else
    {
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.M2.toPrecision(4);
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.STD2.toPrecision(4);
    }
  }
  
  if(pd.Mode > 2)
  {
    var thead3  = document.getElementById('calcs3head');
    newCell = document.createElement('th');
    thead3.appendChild(newCell);
    newCell = document.createElement('th');
    thead3.appendChild(newCell);
    newCell.textContent = 'Total N';
    newCell = document.createElement('th');
    thead3.appendChild(newCell);
    if(pd.DisType3 === 'lognormal')
      newCell.innerHTML = '&micro;<sub>g</sub>';
    else
      newCell.innerHTML = '&micro;';
    newCell = document.createElement('th');
    thead3.appendChild(newCell);
    if(pd.DisType3 === 'lognormal')
      newCell.innerHTML = '&sigma;<sub>g</sub>';
    else
      newCell.innerHTML = '&sigma;';

    var tbody3  = document.getElementById('calcs3');
    var newRow3 = tbody3.insertRow(-1);
    
    newCell = newRow3.insertCell(-1);
    newCell.textContent = 'User:';
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.NL3.toString();
    if(pd.DisType3 === 'lognormal')
    {
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.MG3.toPrecision(4);
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.STDG3.toPrecision(4);
    }
    else
    {     
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.M3.toPrecision(4);
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.STD3.toPrecision(4);
    }
  }
  
  //second row
  newRow1 = tbody1.insertRow(-1);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = 'Calculated:';
  newCell = newRow1.insertCell(-1);
  newCell.textContent = parseInt(pd.sumni1).toString();
  if(pd.DisType1 === 'lognormal')
  {
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.ugn1.toPrecision(4);
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.ogn1.toPrecision(4);
  }
  else
  {
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.un1.toPrecision(4);
    newCell = newRow1.insertCell(-1);
    newCell.textContent = pd.on1.toPrecision(4);
  }
  
  if(pd.Mode > 1)
  {
    var tbody2  = document.getElementById('calcs2');
    var newRow2 = tbody2.insertRow(-1);
      
    newCell = newRow2.insertCell(-1);
    newCell.textContent = 'Calculated:';
    newCell = newRow2.insertCell(-1);
    newCell.textContent = parseInt(pd.sumni2).toString();
    if(pd.DisType2 === 'lognormal')
    {
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.ugn2.toPrecision(4);
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.ogn2.toPrecision(4);
    }
    else
    {
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.un2.toPrecision(4);
      newCell = newRow2.insertCell(-1);
      newCell.textContent = pd.on2.toPrecision(4);
    }
  }
  
  if(pd.Mode > 2)
  {
    var tbody3  = document.getElementById('calcs3');
    var newRow3 = tbody3.insertRow(-1);
    
    newCell = newRow3.insertCell(-1);
    newCell.textContent = 'Calculated:';
    newCell = newRow3.insertCell(-1);
    newCell.textContent = parseInt(pd.sumni3).toString();
    if(pd.DisType3 === 'lognormal')
    {
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.ugn3.toPrecision(4);
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.ogn3.toPrecision(4);
    }
    else
    {     
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.un3.toPrecision(4);
      newCell = newRow3.insertCell(-1);
      newCell.textContent = pd.on3.toPrecision(4);
    }
  }
   
}

pd.AddRow = function (index)
{
  var tbodygen  = document.getElementById('resultbodygen');
  var newRowgen = tbodygen.insertRow(-1);
  
  var newCell = newRowgen.insertCell(-1);
  newCell.textContent = (index + 1).toString();
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Dp[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Vp[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Vlo[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Vhi[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Dlo[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Dhi[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Vrat[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.Mp[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.deltav[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.deltad[index].toPrecision(4);
  newCell = newRowgen.insertCell(-1);
  newCell.textContent = pd.lnDp[index].toPrecision(4);

  var tbody1  = document.getElementById('resultbody1');
  var newRow1 = tbody1.insertRow(-1);
  
  newCell = newRow1.insertCell(-1);
  newCell.textContent = (index + 1).toString();
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.Dp[index].toPrecision(4);
  
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.ni1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.deltalnDp[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.dndlnDp1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.nidlnDp1[index].toString();
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.U1[index].toPrecision(6);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.Dbar1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.vi1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.dvdlnDp1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.mi1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.dmdlnDp1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.mfi1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.dmfdlnDp1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.a1[index].toPrecision(4);
  newCell = newRow1.insertCell(-1);
  newCell.textContent = pd.dadlnDp1[index].toPrecision(4);

  if(pd.Mode > 1)
  {  
    var tbody2  = document.getElementById('resultbody2');
    var newRow2 = tbody2.insertRow(-1);
    
    newCell = newRow2.insertCell(-1);
    newCell.textContent = (index + 1).toString();
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.Dp[index].toPrecision(4);
  
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.ni2[index].toPrecision(4);
    newRow2.insertCell(-1);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.dndlnDp2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.nidlnDp2[index].toString();
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.U2[index].toPrecision(6);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.Dbar2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.vi2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.dvdlnDp2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.mi2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.dmdlnDp2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.mfi2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.dmfdlnDp2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.a2[index].toPrecision(4);
    newCell = newRow2.insertCell(-1);
    newCell.textContent = pd.dadlnDp2[index].toPrecision(4);
  }
  
  if(pd.Mode > 2)
  {
    var tbody3  = document.getElementById('resultbody3');
    var newRow3 = tbody3.insertRow(-1);
    
    newCell = newRow3.insertCell(-1);
    newCell.textContent = (index + 1).toString();
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.Dp[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.ni3[index].toPrecision(4);
    newRow3.insertCell(-1);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.dndlnDp3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.nidlnDp3[index].toString();
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.U3[index].toPrecision(6);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.Dbar3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.vi3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.dvdlnDp3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.mi3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.dmdlnDp3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.mfi3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.dmfdlnDp3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.a3[index].toPrecision(4);
    newCell = newRow3.insertCell(-1);
    newCell.textContent = pd.dadlnDp3[index].toPrecision(4);
  }
}

pd.Plot = function (chartid, plottitle, xvalues, yvalues, log, xlabel, ylabel, seriescolor)
{
  var i;
  var series = new Array();
  var xaxisrenderer;
  
  series[0] = new Array();
  for(i=0; i<yvalues.length; ++i)
  {
    series[0][i] = new Array();
    series[0][i][0] = xvalues[i];
    series[0][i][1] = yvalues[i];
  }
  
  if(log)
    xaxisrenderer = $.jqplot.LogAxisRenderer;
  else
    xaxisrenderer = $.jqplot.LinearAxisRenderer;

  $.jqplot(chartid,  series,
  { 
    title:plottitle,
    axes:
    {
      xaxis:
      {
        renderer: xaxisrenderer,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: xlabel,
        tickOptions: { formatString: "%.1g" },
        labelOptions: {
          textColor: "#000000"
        }
      },       
      yaxis:
      {
        label: ylabel,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        tickOptions: { formatString: "%.1g" },
        labelOptions: {
          textColor: "#000000"
        }
      }
    },
    grid:
    {
        borderColor: "#000000"
    },
    series:
    [
      {
        color:seriescolor,
        showMarker: pd.ShowMarkers
      }
    ]
  });
}

pd.CombinedPlot = function (chartid, plottitle, xvalues, yvalues1, yvalues2, yvalues3, comb, xlabel, ylabel)
{
  var i, index, count;
  var series = new Array();
  var xaxisrenderer;
  var yaxisrenderer;
  var color3, color4;
  var label3, label4;
  var yaxismin, yaxismax;
  
  if(pd.UseYaxisRange)
  { 
    yaxismin = pd.Ymin;
    yaxismax = pd.Ymax;
  }
  else
  {
    yaxismin = null;
    yaxismax = null;
  }
  
  index = 0;
  count = 0;
  series[index] = new Array();
  for(i=0; i<yvalues1.length; ++i)
  {
    if(!pd.UseYaxisRange || (yvalues1[i] >= yaxismin &&
      yvalues1[i] <= yaxismax))
    {
      series[index][count] = new Array();
      series[index][count][0] = xvalues[i];
      series[index][count++][1] = yvalues1[i];
    }
  }
  index++;
  
  count = 0;
  series[index] = new Array();
  for(i=0; i<yvalues2.length; ++i)
  {
    if(!pd.UseYaxisRange || (yvalues2[i] >= yaxismin &&
      yvalues2[i] <= yaxismax))
    {
      series[index][count] = new Array();
      series[index][count][0] = xvalues[i];
      series[index][count++][1] = yvalues2[i];
    }
  }
  index++;
  
  count = 0;
  if(yvalues3 !== undefined)
  {
    series[index] = new Array();
    for(i=0; i<yvalues3.length; ++i)
    {
      if(!pd.UseYaxisRange || (yvalues3[i] >= yaxismin &&
        yvalues3[i] <= yaxismax))
      {
        series[index][count] = new Array();
        series[index][count][0] = xvalues[i];
        series[index][count++][1] = yvalues3[i];
      }
    }
    index++;
    color3 = pd.Mode3Color;
    color4 = pd.CombinedColor;
    label3 = "Mode3";
    label4 = "Combined";
  }
  else
  {
    color3 = pd.CombinedColor;
    color4 = pd.Mode3Color;
    label3 = "Combined";
    label4 = "Mode3";
  }
  
  count = 0;
  series[index] = new Array();
  for(i=0; i<yvalues1.length; ++i)
  {
    if(!pd.UseYaxisRange || (comb[i] >= yaxismin &&
      comb[i] <= yaxismax))
    {
      series[index][count] = new Array();
      series[index][count][0] = xvalues[i];
      series[index][count++][1] = comb[i];
    }
  }
  
  if(document.getElementById('xaxisLog').checked)
    xaxisrenderer = $.jqplot.LogAxisRenderer;
  else
    xaxisrenderer = $.jqplot.LinearAxisRenderer;
  if(document.getElementById('yaxisLog').checked)
    yaxisrenderer = $.jqplot.LogAxisRenderer;
  else
    yaxisrenderer = $.jqplot.LinearAxisRenderer;

  $.jqplot(chartid,  series,
  { 
    title:plottitle,
    axes:
    {
      xaxis:
      {
        renderer: xaxisrenderer,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: xlabel,
        tickOptions: { formatString: "%.1g" },
        labelOptions: {
          textColor: "#000000"
        }
      },       
      yaxis:
      {
        renderer: yaxisrenderer,
        label: ylabel,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        tickOptions: { formatString: "%.1g" },
        labelOptions: {
          textColor: "#000000"
        }
      }
    },
    grid:
    {
        borderColor: "#000000"
    },
    series:
    [
      {
        color:pd.Mode1Color,
        label: 'Mode1',
        showMarker: pd.ShowMarkers
      }, 
      {
        color:pd.Mode2Color,
        label: 'Mode2',
        showMarker: pd.ShowMarkers
      }, 
      {
        color:color3,
        label: label3,
        showMarker: pd.ShowMarkers
      }, 
      {
        color:color4,
        label: label4,
        showMarker: pd.ShowMarkers
      },
    ],
    legend:
    {
      show: true
    }
  });
}

pd.RandomColor = function ()
{
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

pd.Clear = function ()
{
  var nodestoclear = ['calcs1', 'calcs2', 'calcs3', 'resultbodygen', 'resultbody1', 'resultbody2', 'resultbody3',
  'calcs1head', 'calcs2head', 'calcs3head'];
  pd.ClearChildNodes(nodestoclear);
  pd.ClearPlots();
}

pd.ClearPlots = function ()
{
  var nodestoclear = ['chart1', 'chart2', 'chart3', 'chart4'];
  pd.ClearChildNodes(nodestoclear);
}

pd.ClearChildNodes = function (nodeids)
{
  var i;
  for(i=0; i<nodeids.length; i++)
  {
    var node  = document.getElementById(nodeids[i]);
    while (node.hasChildNodes())
    {
      node.removeChild(node.firstChild);
    }
  }
}

pd.ChangePlot = function ()
{
  if(pd.ni1 !== undefined)
  {
    var ni   = document.getElementById('PlotNi');
    var dni  = document.getElementById('PlotdNi');
    var vi   = document.getElementById('Plotvi');
    var dvi  = document.getElementById('Plotdvi');
    var mi   = document.getElementById('Plotmi');
    var dmi  = document.getElementById('Plotdmi');
    var mfi  = document.getElementById('Plotmfi');
    var dmfi = document.getElementById('Plotdmfi');
    var ai   = document.getElementById('Plotai');
    var dai  = document.getElementById('Plotdai');
    
    pd.ClearPlots();
    
    if(ni.checked)
    {
      
      pd.Plot('chart1', "N", pd.Dp, pd.ni1,      
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', "N", pd.Dp, pd.ni2,      
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', "N", pd.Dp, pd.ni3,      
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.ni1, pd.ni2, undefined, false);
        pd.CombinedPlot('chart4', "N", pd.Dp, pd.ni1, pd.ni2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.ni1, pd.ni2, pd.ni3, false);
        pd.CombinedPlot('chart4', "N", pd.Dp, pd.ni1, pd.ni2, pd.ni3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(dni.checked)
    {
      pd.Plot('chart1', '&Delta;N/&Delta;lnD', pd.Dp, pd.dndlnDp1, 
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', '&Delta;N/&Delta;lnD', pd.Dp, pd.dndlnDp2, 
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', '&Delta;N/&Delta;lnD', pd.Dp, pd.dndlnDp3, 
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.ni1, pd.ni2, undefined, true);
        pd.CombinedPlot('chart4', '&Delta;N/&Delta;lnD', 
                pd.Dp, pd.dndlnDp1, pd.dndlnDp2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.ni1, pd.ni2, pd.ni3, true);
        pd.CombinedPlot('chart4', '&Delta;N/&Delta;lnD', 
                pd.Dp, pd.dndlnDp1, pd.dndlnDp2, pd.dndlnDp3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [#/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(vi.checked)
    {
      pd.Plot('chart1', "V", pd.Dp, pd.vi1,      
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', "V", pd.Dp, pd.vi2,      
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', "V", pd.Dp, pd.vi3,      
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.vi1, pd.vi2, undefined, false);
        pd.CombinedPlot('chart4', "V", pd.Dp, pd.vi1, pd.vi2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.vi1, pd.vi2, pd.vi3, false);
        pd.CombinedPlot('chart4', "V", pd.Dp, pd.vi1, pd.vi2, pd.vi3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(dvi.checked)
    {
      pd.Plot('chart1', '&Delta;V/&Delta;lnD', pd.Dp, pd.dvdlnDp1, 
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', '&Delta;V/&Delta;lnD', pd.Dp, pd.dvdlnDp2, 
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', '&Delta;V/&Delta;lnD', pd.Dp, pd.dvdlnDp3, 
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.vi1, pd.vi2, undefined, true);
        pd.CombinedPlot('chart4', '&Delta;V/&Delta;lnD', 
                pd.Dp, pd.dvdlnDp1, pd.dvdlnDp2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.vi1, pd.vi2, pd.vi3, true);
        pd.CombinedPlot('chart4', '&Delta;V/&Delta;lnD', 
                pd.Dp, pd.dvdlnDp1, pd.dvdlnDp2, pd.dvdlnDp3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Volume [cm' + pd.htmlDecode('&sup3;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(mi.checked)
    {
      pd.Plot('chart1', "M", pd.Dp, pd.mi1,     
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', "M", pd.Dp, pd.mi2,     
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', "M", pd.Dp, pd.mi3,     
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.mi1, pd.mi2, undefined, false);
        pd.CombinedPlot('chart4', "M", pd.Dp, pd.mi1, pd.mi2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.mi1, pd.mi2, pd.mi3, false);
        pd.CombinedPlot('chart4', "M", pd.Dp, pd.mi1, pd.mi2, pd.mi3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(dmi.checked)
    {
      pd.Plot('chart1', '&Delta;M/&Delta;lnD', pd.Dp, pd.dmdlnDp1, 
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', '&Delta;M/&Delta;lnD', pd.Dp, pd.dmdlnDp2, 
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', '&Delta;M/&Delta;lnD', pd.Dp, pd.dmdlnDp3, 
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.mi1, pd.mi2, undefined, true);
        pd.CombinedPlot('chart4', '&Delta;M/&Delta;lnD', 
                pd.Dp, pd.dmdlnDp1, pd.dmdlnDp2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.mi1, pd.mi2, pd.mi3, true);
        pd.CombinedPlot('chart4', '&Delta;M/&Delta;lnD', 
                pd.Dp, pd.dmdlnDp1, pd.dmdlnDp2, pd.dmdlnDp3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [' + pd.htmlDecode('&micro;') + 'g/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(mfi.checked)
    {
      pd.Plot('chart1', "m", pd.Dp, pd.mfi1,     
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', "m", pd.Dp, pd.mfi2,     
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', "m", pd.Dp, pd.mfi3,     
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.mfi1, pd.mfi2, undefined, false);
        pd.CombinedPlot('chart4', "m", pd.Dp, pd.mfi1, pd.mfi2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [kg/kg]');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.mfi1, pd.mfi2, pd.mfi3, false);
        pd.CombinedPlot('chart4', "m", pd.Dp, pd.mfi1, pd.mfi2, pd.mfi3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [kg/kg]');
      }
    }
    else if(dmfi.checked)
    {
      pd.Plot('chart1', '&Delta;m/&Delta;lnD', pd.Dp, pd.dmfdlnDp1, 
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', '&Delta;m/&Delta;lnD', pd.Dp, pd.dmfdlnDp2, 
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', '&Delta;m/&Delta;lnD', pd.Dp, pd.dmfdlnDp3, 
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 'Concentration [kg/kg]', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.mfi1, pd.mfi2, undefined, true);
        pd.CombinedPlot('chart4', '&Delta;m/&Delta;lnD', 
                pd.Dp, pd.dmfdlnDp1, pd.dmfdlnDp2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [kg/kg]');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.mfi1, pd.mfi2, pd.mfi3, true);
        pd.CombinedPlot('chart4', '&Delta;m/&Delta;lnD', 
                pd.Dp, pd.dmfdlnDp1, pd.dmfdlnDp2, pd.dmfdlnDp3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Concentration [kg/kg]');
      }
    }
    else if(ai.checked)
    {
      pd.Plot('chart1', "A", pd.Dp, pd.a1,      
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', "A", pd.Dp, pd.a2,      
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', "A", pd.Dp, pd.a3,      
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.a1, pd.a2, undefined, false);
        pd.CombinedPlot('chart4', "A", pd.Dp, pd.a1, pd.a2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.a1, pd.a2, pd.a3, false);
        pd.CombinedPlot('chart4', "A", pd.Dp, pd.a1, pd.a2, pd.a3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
    else if(dai.checked)
    {
      pd.Plot('chart1', '&Delta;A/&Delta;lnD', pd.Dp, pd.dadlnDp1,      
              pd.DisType1 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
              'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode1Color);
      if(pd.Mode > 1)
      {
        pd.Plot('chart2', '&Delta;A/&Delta;lnD', pd.Dp, pd.dadlnDp2,      
                pd.DisType2 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode2Color);
      }
      if(pd.Mode > 2)
      {
        pd.Plot('chart3', '&Delta;A/&Delta;lnD', pd.Dp, pd.dadlnDp3,      
                pd.DisType3 === 'lognormal', 'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']', pd.Mode3Color);
      }
      if(pd.Mode === 2)
      {
        var comb = pd.CreateCombinedSeries(pd.a1, pd.a2, undefined, true);
        pd.CombinedPlot('chart4', '&Delta;A/&Delta;lnD', 
                pd.Dp, pd.dadlnDp1, pd.dadlnDp2, undefined, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
      if(pd.Mode === 3)
      {
        var comb = pd.CreateCombinedSeries(pd.a1, pd.a2, pd.a3, true);
        pd.CombinedPlot('chart4', '&Delta;A/&Delta;lnD', 
                pd.Dp, pd.dadlnDp1, pd.dadlnDp2, pd.dadlnDp3, comb,
                'Particle Size [' + pd.htmlDecode('&micro;') + 'm]', 
                'Surface Area [' + pd.htmlDecode('&micro;') + 'm' + pd.htmlDecode('&sup2;') + '/cm' + pd.htmlDecode('&sup3;') + ']');
      }
    }
  }
}

pd.htmlDecode = function (input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

pd.CreateCombinedSeries = function (mode1, mode2, mode3, normal)
{
  var comb = new Array(mode1.length);
  var i;
  
  for(i=0;i<mode1.length;++i)
  {
    if(normal)
    {
      if(mode3 !== undefined)
        comb[i] = (mode1[i] + mode2[i] + mode3[i]) / Math.log(pd.Dhi[i] / pd.Dlo[i]);
       else
        comb[i] = (mode1[i] + mode2[i]) / Math.log(pd.Dhi[i] / pd.Dlo[i]);
    }
    else
    {
      if(mode3 !== undefined)
        comb[i] = mode1[i] + mode2[i] + mode3[i];
      else
        comb[i] = mode1[i] + mode2[i];
    }
  }
  return comb;
}

pd.LoadLibrary = function ()
{
  var txa = document.getElementById('libtext');
  
  txa.value = pd.CreateLibrary();
}

pd.CreateLibrary = function ()
{
  var lib = '';
  var i;
  var mfi;
  
  lib += 'ContaminantLibrary ContamW 3.0a\n';
  lib += '\n';
  lib += '0 ! contaminants:\n';
  lib += pd.NB.toString() + ' ! species:\n';
  lib += '! # s t   molwt    mdiam       edens       decay       Dm          CCdef        Cp    u...  name\n'
  for(i=0; i<pd.NB; ++i)
  {
    switch(pd.Mode)
    {
      case 1:
        mfi = pd.mfi1[i];
        break;
      case 2:
        mfi = pd.mfi1[i] + pd.mfi2[i];
        break;
      case 3:
        mfi = pd.mfi1[i] + pd.mfi2[i] + pd.mfi3[i];
        break;
    }
    lib += '  ' + (i + 1).toString() + ' 0 0  0.0000 ' + (pd.Dp[i]/1000000).toPrecision(4) + ' ' + pd.RHOpart.toPrecision(4) + 
      ' 0.0000e+000 2.0000e-005 ' + mfi.toPrecision(4) + ' 1000.000 25 6 0 0 0 ' + 'diam' + pd.Dp[i].toPrecision(4) + '\n';
    lib += 'particle with diameter of ' + pd.Dp[i].toPrecision(4) + ' micrometers\n';
  }
  lib += '-999\n';
  lib += '0 ! exposure limits:\n-999\n';
  lib += '0 ! filter elements:\n-999\n';
  lib += '0 ! kinetic reactions:\n-999\n';
  lib += '0 ! source/sink elements:\n-999\n';
  lib += '* end library.\n';
  
  return lib;
}

pd.ShowHideResults = function ()
{
  var div = document.getElementById('resultscalcs');
  
  if( window.getComputedStyle(div,null).getPropertyValue("display") === 'none' )
    div.style.display = 'block';
  else  
    div.style.display = 'none';    
}

pd.Distr1Change = function ()
{
  if(document.getElementById('lognormal1').checked)
  {
    document.getElementById('m1text').innerHTML = "&micro;<sub>g</sub>:";
    document.getElementById('std1text').innerHTML = "&sigma;<sub>g</sub>:";
  }
  else
  {
    document.getElementById('m1text').innerHTML = "&micro;:";
    document.getElementById('std1text').innerHTML = "&sigma;:";
  }
}

pd.Distr2Change = function ()
{
  if(document.getElementById('lognormal2').checked)
  {
    document.getElementById('m2text').innerHTML = "&micro;<sub>g</sub>:";
    document.getElementById('std2text').innerHTML = "&sigma;<sub>g</sub>:";
  }
  else
  {
    document.getElementById('m2text').innerHTML = "&micro;:";
    document.getElementById('std2text').innerHTML = "&sigma;:";
  }
}

pd.Distr3Change = function ()
{
  if(document.getElementById('lognormal3').checked)
  {
    document.getElementById('m3text').innerHTML = "&micro;<sub>g</sub>:";
    document.getElementById('std3text').innerHTML = "&sigma;<sub>g</sub>:";
  }
  else
  {
    document.getElementById('m3text').innerHTML = "&micro;:";
    document.getElementById('std3text').innerHTML = "&sigma;:";
  }
}

pd.SetYAxis = function (userset)
{
  if(userset)
  {
    var mintext = document.getElementById('yaxismin').value;
    var maxtext = document.getElementById('yaxismax').value;
    
    var min = parseFloat(mintext);
    var max = parseFloat(maxtext);
    
    if(isNaN(min))
    {
      alert('Y value minimum is not a valid number.');
      return;
    }
    
    if(isNaN(max))
    {
      alert('Y value maximum is not a valid number.');
      return;
    }
    
    pd.Ymax = max;
    pd.Ymin = min;
    pd.UseYaxisRange = true;  
  }
  else
    pd.UseYaxisRange = false;  
  
  pd.ChangePlot();
}

pd.ModesChange = function ()
{
  if (!pd.CustomBins)
  {
    if (document.getElementById('mode1').checked)
    {
      document.getElementById('mode2inputs').style.display = 'none';
      document.getElementById('mode3inputs').style.display = 'none';
    }
    else if (document.getElementById('mode2').checked)
    {
      document.getElementById('mode2inputs').style.display = 'grid';
      document.getElementById('mode3inputs').style.display = 'none';
    }
    else if (document.getElementById('mode3').checked)
    {
      document.getElementById('mode2inputs').style.display = 'grid';
      document.getElementById('mode3inputs').style.display = 'grid';
    }
  }
}

pd.BinsChange = function ()
{
  if (document.getElementById('regularbins').checked)
  {
    pd.CustomBins = false;
    document.getElementById('usecustombins').disabled = true;
    document.getElementById('nb').disabled = false;
    document.getElementById('d1').disabled = false;
    document.getElementById('dn').disabled = false;
    document.getElementById("mode1inputs").style.display = 'block';
    if (document.getElementById('mode2').checked)
    {
      document.getElementById("mode2inputs").style.display = 'block';
    }
    if (document.getElementById('mode3').checked)
    {
      document.getElementById("mode3inputs").style.display = 'block';
      document.getElementById("mode2inputs").style.display = 'block';
    }
  }
  else
  {
    pd.CustomBins = true;
    document.getElementById('usecustombins').disabled = false;
    document.getElementById('nb').disabled = true;
    document.getElementById('d1').disabled = true;
    document.getElementById('dn').disabled = true;
    document.getElementById("mode1inputs").style.display = 'none';
    document.getElementById("mode2inputs").style.display = 'none';
    document.getElementById("mode3inputs").style.display = 'none';
  }

}

pd.UseCustomBins = function ()
{
  var numBins;
  numBins = parseInt(document.getElementById('nb').value);
  if (!isNaN(numBins))
  {
    pd.NB = numBins;
  }
  if (document.getElementById('mode1').checked)
    pd.Mode = 1;
  else if (document.getElementById('mode2').checked)
    pd.Mode = 2;
  else if (document.getElementById('mode3').checked)
    pd.Mode = 3;
  pd.OpenDialog('custombins.htm', pd.CustomBinsClosed, 'Define Custom Bins');
}

pd.CustomBinsClosed = function (dialogResult)
{
  if (dialogResult)
  {
    var iframe = document.getElementById('dialogframe');

    pd.Dp = iframe.contentWindow.Bins.slice(0);
    pd.NB = iframe.contentWindow.numBins;
    pd.ni1 = iframe.contentWindow.Ni1.slice(0);
    if (pd.Mode > 1)
      pd.ni2 = iframe.contentWindow.Ni2.slice(0);
    if (pd.Mode > 2)
      pd.ni3 = iframe.contentWindow.Ni3.slice(0);
  }
}

pd.Help = function ()
{
  pd.OpenDialog('help.htm', undefined, 'Help');
}

pd.OpenDialog = function (url, callback, dialogtitle)
{
  var iframe = document.getElementById('dialogframe');
  var container = document.getElementById('dialogcontainer');
  var dt = document.getElementById('dialogtitle');
  dt.textContent = dialogtitle;
  iframe.src = url;
  container.style.display = 'block';
  pd.dialogcallback = callback;  
}

pd.CloseDialog = function (dialogResult)
{
  document.getElementById('dialogcontainer').style.display = 'none';

  if (pd.dialogcallback !== undefined)
    pd.dialogcallback(dialogResult);
  var iframe = document.getElementById('dialogframe');
  iframe.contentDocument.open();
  iframe.contentDocument.close();
}

pd.CreateCTMFile = function ()
{
  var file ='';
  var mfi;
  
  file += 'SpeciesFile ContamW 2.0\n';
  file += 'created with CONTAM PDC\n';
  file += '1/1\n';
  file += '1/1\n';
  file += pd.NB.toString() + '\n';
  for(i=0; i<pd.NB; ++i)
  {
    file += 'diam' + pd.Dp[i].toPrecision(4) + '\n';
  }  
  file += '!Date\tTime';
  for(i=0; i<pd.NB; ++i)
  {
    file += '\tdiam' + pd.Dp[i].toPrecision(4);
  }
  file += '\n';
  
  file += '1/1\t00:00:00';
  for(i=0; i<pd.NB; ++i)
  {
    switch(pd.Mode)
    {
      case 1:
        mfi = pd.mfi1[i];
        break;
      case 2:
        mfi = pd.mfi1[i] + pd.mfi2[i];
        break;
      case 3:
        mfi = pd.mfi1[i] + pd.mfi2[i] + pd.mfi3[i];
        break;
    }
    file += '\t' +  mfi.toPrecision(4);
  }
  file += '\n';
  
  file += '1/1\t24:00:00';
  for(i=0; i<pd.NB; ++i)
  {
    switch(pd.Mode)
    {
      case 1:
        mfi = pd.mfi1[i];
        break;
      case 2:
        mfi = pd.mfi1[i] + pd.mfi2[i];
        break;
      case 3:
        mfi = pd.mfi1[i] + pd.mfi2[i] + pd.mfi3[i];
        break;
    }
    file += '\t' +  mfi.toPrecision(4);
  }
  file += '\n';
  
  return file;
}


pd.LoadCTMFile = function ()
{
  var txa = document.getElementById('ctmtext');
  
  txa.value = pd.CreateCTMFile();
}

pd.ChangeMarkers = function ()
{
  pd.ShowMarkers = !pd.ShowMarkers;
  pd.ChangePlot();
}
