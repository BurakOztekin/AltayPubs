using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PubsApp.Models;

public partial class Titleauthor
{
    public string AuId { get; set; }

    public string TitleId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Author order must be at least 1.")]
    public byte? AuOrd { get; set; }

    [Range(1, 100, ErrorMessage = "Royalty percentage must be between 1 and 100.")]
    public int? Royaltyper { get; set; }

    public virtual Author Au { get; set; }

    public virtual Title Title { get; set; }
}