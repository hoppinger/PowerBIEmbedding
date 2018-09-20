using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PowerBIPoC.Models{
  public partial class PowerBIPoCContext : DbContext {

      public PowerBIPoCContext(DbContextOptions<PowerBIPoCContext> options) : base(options){}
  }
}
